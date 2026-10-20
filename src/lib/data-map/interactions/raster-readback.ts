import {
  Buffer,
  type Device,
  type Fence,
  type Texture,
  type TextureReadOptions,
} from '@luma.gl/core';
import type { WebGLDevice } from '@luma.gl/webgl';

/** Readback buffers owned by one map, reused only after their CPU reads finish. */
export class RasterReadbackPool {
  private idle = new Map<Device, Buffer[]>();
  private destroyed = false;

  createBatch() {
    return new RasterReadbackBatch(this);
  }

  acquire(device: Device, byteLength: number): Buffer {
    if (this.destroyed) {
      throw new Error('Raster readback pool is destroyed');
    }
    const buffers = this.idle.get(device);
    const index = buffers?.findIndex((buffer) => buffer.byteLength >= byteLength) ?? -1;
    return index >= 0
      ? buffers.splice(index, 1)[0]
      : device.createBuffer({ byteLength, usage: Buffer.COPY_DST | Buffer.MAP_READ });
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
    for (const buffers of this.idle.values()) {
      buffers.forEach((buffer) => buffer.destroy());
    }
    this.idle.clear();
    // Active buffers are destroyed by release() once their reads finish.
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
    let fence: Fence;
    try {
      fence = device.createFence();
      (device as WebGLDevice).gl.flush();
      await fence.signaled;
    } finally {
      fence?.destroy();
    }
  }
}
