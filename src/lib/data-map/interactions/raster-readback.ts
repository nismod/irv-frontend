import { Buffer, type Device, type Texture, type TextureReadOptions } from '@luma.gl/core';
import type { WebGLDevice } from '@luma.gl/webgl';

/** Readback buffers owned by one map, reused only after their CPU reads finish. */
export class RasterReadbackPool {
  private idle = new Map<Device, Buffer[]>();
  private destroyed = false;
  private abortController = new AbortController();

  get signal() {
    return this.abortController.signal;
  }

  createBatch() {
    return new RasterReadbackBatch(this);
  }

  acquire(device: Device, byteLength: number): Buffer {
    if (this.destroyed) {
      throw new Error('Raster readback pool is destroyed');
    }
    if (device.type === 'webgl' && (device as WebGLDevice).gl.isContextLost()) {
      this.discardDevice(device);
      throw new Error('WebGL context lost during raster readback');
    }
    const buffers = this.idle.get(device);
    const index = buffers?.findIndex((buffer) => buffer.byteLength >= byteLength) ?? -1;
    if (index >= 0) {
      return buffers.splice(index, 1)[0];
    }
    const buffer = device.createBuffer({ byteLength, usage: Buffer.COPY_DST | Buffer.MAP_READ });
    try {
      if (device.type === 'webgl') {
        const { gl } = device as WebGLDevice;
        // luma.gl 9.4 allocates MAP_READ buffers with STATIC_DRAW on WebGL.
        // Set the readback hint once, before any copies use this pooled buffer.
        const previous = gl.getParameter(gl.PIXEL_PACK_BUFFER_BINDING) as WebGLBuffer | null;
        try {
          gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buffer.handle as WebGLBuffer);
          gl.bufferData(gl.PIXEL_PACK_BUFFER, byteLength, gl.STREAM_READ);
        } finally {
          gl.bindBuffer(gl.PIXEL_PACK_BUFFER, previous);
        }
      }
      return buffer;
    } catch (error) {
      buffer.destroy();
      throw error;
    }
  }

  release(device: Device, buffer: Buffer, reusable: boolean) {
    if (this.destroyed || !reusable) {
      buffer.destroy();
      return;
    }
    const buffers = this.idle.get(device) ?? [];
    buffers.push(buffer);
    this.idle.set(device, buffers);
  }

  destroy() {
    this.destroyed = true;
    this.abortController.abort();
    for (const device of this.idle.keys()) {
      this.discardDevice(device);
    }
    // Active buffers are destroyed by release() once their reads finish.
  }

  discardDevice(device: Device) {
    this.idle.get(device)?.forEach((buffer) => buffer.destroy());
    this.idle.delete(device);
  }
}

type Completion = {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: unknown) => void;
};

/** Enqueue all texture copies before submit(), then wait once per WebGL device. */
export class RasterReadbackBatch {
  private completions = new Map<Device, Completion>();
  private submitted = false;

  constructor(private pool: RasterReadbackPool) {}

  async readPixel(texture: Texture, region: TextureReadOptions): Promise<Uint8Array> {
    if (this.submitted) {
      throw new Error('Raster readback batch is already submitted');
    }
    const { device } = texture;
    const { byteLength } = texture.computeMemoryLayout(region);
    const buffer = this.pool.acquire(device, byteLength);
    let reusable = false;
    try {
      texture.readBuffer(region, buffer);
      let completion = this.completions.get(device);
      if (!completion) {
        let resolve: Completion['resolve'];
        let reject: Completion['reject'];
        const promise = new Promise<void>((onResolve, onReject) => {
          resolve = onResolve;
          reject = onReject;
        });
        completion = { promise, resolve, reject };
        this.completions.set(device, completion);
      }
      await completion.promise;
      if (this.pool.signal.aborted) {
        throw new Error('Raster readback pool destroyed');
      }
      const pixels = await buffer.readAsync(0, byteLength);
      reusable = true;
      return pixels;
    } finally {
      this.pool.release(device, buffer, reusable);
    }
  }

  submit() {
    if (this.submitted) {
      throw new Error('Raster readback batch is already submitted');
    }
    this.submitted = true;
    for (const [device, completion] of this.completions) {
      this.waitForCopies(device).then(completion.resolve, completion.reject);
    }
  }

  private async waitForCopies(device: Device) {
    // WebGPU's readAsync handles synchronization. WebGL currently reads the
    // buffer synchronously, so wait for every queued copy before reading any.
    if (device.type !== 'webgl') {
      return;
    }
    const { gl } = device as WebGLDevice;
    try {
      await waitForWebGLCopies(gl, this.pool.signal);
    } finally {
      if (gl.isContextLost()) {
        this.pool.discardDevice(device);
      }
    }
  }
}

/** Own the sync and timer so failure, context loss and teardown all stop polling. */
function waitForWebGLCopies(gl: WebGL2RenderingContext, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    let sync: WebGLSync | null = null;
    let timer: ReturnType<typeof setTimeout>;
    let settled = false;

    const finish = (error?: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      gl.canvas.removeEventListener('webglcontextlost', onContextLost);
      if (sync) gl.deleteSync(sync);
      if (error) reject(error);
      else resolve();
    };
    const onAbort = () => finish(new Error('Raster readback pool destroyed'));
    const onContextLost = () => finish(new Error('WebGL context lost during raster readback'));
    const poll = () => {
      try {
        if (signal.aborted) {
          onAbort();
          return;
        }
        if (gl.isContextLost()) {
          onContextLost();
          return;
        }
        const status = gl.clientWaitSync(sync, 0, 0);
        if (status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED) {
          finish();
        } else if (status === gl.TIMEOUT_EXPIRED) {
          timer = setTimeout(poll, 1);
        } else {
          finish(new Error('WebGL fence wait failed during raster readback'));
        }
      } catch (error) {
        finish(error);
      }
    };

    signal.addEventListener('abort', onAbort, { once: true });
    gl.canvas.addEventListener('webglcontextlost', onContextLost, { once: true });
    try {
      if (signal.aborted) {
        onAbort();
        return;
      }
      if (gl.isContextLost()) {
        onContextLost();
        return;
      }
      sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) throw new Error('Failed to create WebGL readback fence');
      gl.flush();
      poll();
    } catch (error) {
      finish(error);
    }
  });
}
