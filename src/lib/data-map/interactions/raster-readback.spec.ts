import type { Texture } from '@luma.gl/core';
import { GL } from '@luma.gl/webgl/constants';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RasterReadbackPool } from './raster-readback';
import { makeReadbackDevice as makeDevice } from './raster-readback-test-utils';

function deferred() {
  let resolve: () => void;
  const promise = new Promise<void>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

function makeTexture(
  device: ReturnType<typeof makeDevice>,
  color = [1, 2, 3, 255],
  byteLength = 4,
) {
  return {
    device,
    computeMemoryLayout: vi.fn(() => ({ byteLength })),
    readBuffer: vi.fn((_region, buffer) => {
      buffer.readAsync.mockResolvedValue(new Uint8Array(color));
    }),
  } as unknown as Texture;
}

const region = { x: 1, y: 2, width: 1, height: 1 };

describe('raster readback batches', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('shares one fence and flush after all copies, preserving separate pixel results', async () => {
    const device = makeDevice();
    vi.useFakeTimers();
    device.gl.clientWaitSync.mockReturnValue(GL.TIMEOUT_EXPIRED);
    const firstTexture = makeTexture(device);
    const secondTexture = makeTexture(device, [4, 5, 6, 255]);
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const first = batch.readPixel(firstTexture, region);
    const second = batch.readPixel(secondTexture, region);
    const buffers = device.createBuffer.mock.results.map(({ value }) => value);

    expect(device.gl.fenceSync).not.toHaveBeenCalled();
    expect(buffers).toHaveLength(2);
    expect(buffers[0]).not.toBe(buffers[1]);
    batch.submit();
    expect(device.gl.fenceSync).toHaveBeenCalledOnce();
    expect(device.gl.flush).toHaveBeenCalledOnce();
    expect(vi.mocked(secondTexture.readBuffer).mock.invocationCallOrder[0]).toBeLessThan(
      device.gl.fenceSync.mock.invocationCallOrder[0],
    );
    buffers.forEach((buffer) => expect(buffer.readAsync).not.toHaveBeenCalled());

    device.gl.clientWaitSync.mockReturnValue(GL.CONDITION_SATISFIED);
    await vi.advanceTimersByTimeAsync(1);
    await expect(first).resolves.toEqual(new Uint8Array([1, 2, 3, 255]));
    await expect(second).resolves.toEqual(new Uint8Array([4, 5, 6, 255]));
    expect(device.gl.deleteSync).toHaveBeenCalledExactlyOnceWith(
      device.gl.fenceSync.mock.results[0].value,
    );
    expect(vi.getTimerCount()).toBe(0);
    buffers.forEach((buffer) => expect(buffer.destroy).not.toHaveBeenCalled());
    pool.destroy();
    buffers.forEach((buffer) => expect(buffer.destroy).toHaveBeenCalledOnce());
  });

  it('reuses buffers across batches without reading stale pixels', async () => {
    const device = makeDevice();
    const previousBinding = {};
    device.gl.getParameter.mockReturnValue(previousBinding);
    const pool = new RasterReadbackPool();
    for (const color of [
      [1, 2, 3, 255],
      [4, 5, 6, 255],
      [7, 8, 9, 255],
    ]) {
      const batch = pool.createBatch();
      const result = batch.readPixel(makeTexture(device, color), region);
      batch.submit();
      await expect(result).resolves.toEqual(new Uint8Array(color));
    }
    expect(device.createBuffer).toHaveBeenCalledOnce();
    expect(device.gl.bufferData).toHaveBeenCalledExactlyOnceWith(
      device.gl.PIXEL_PACK_BUFFER,
      4,
      device.gl.STREAM_READ,
    );
    expect(device.gl.bindBuffer).toHaveBeenCalledWith(
      device.gl.PIXEL_PACK_BUFFER,
      device.createBuffer.mock.results[0].value.handle,
    );
    expect(device.gl.bindBuffer).toHaveBeenLastCalledWith(
      device.gl.PIXEL_PACK_BUFFER,
      previousBinding,
    );
    expect(device.gl.fenceSync).toHaveBeenCalledTimes(3);
    pool.destroy();
  });

  it('does not recycle buffers until their CPU read has finished', async () => {
    const device = makeDevice();
    const pool = new RasterReadbackPool();
    const firstBatch = pool.createBatch();
    const first = firstBatch.readPixel(makeTexture(device), region);
    const buffer = device.createBuffer.mock.results[0].value;
    const completion = deferred();
    const readStarted = deferred();
    buffer.readAsync.mockImplementation(async () => {
      readStarted.resolve();
      await completion.promise;
      return new Uint8Array([1, 2, 3, 255]);
    });
    firstBatch.submit();
    await readStarted.promise;
    const secondBatch = pool.createBatch();
    const second = secondBatch.readPixel(makeTexture(device), region);
    expect(device.createBuffer).toHaveBeenCalledTimes(2);
    secondBatch.submit();
    await second;
    completion.resolve();
    await first;
    pool.destroy();
  });

  it('allocates a larger buffer when the texture memory layout requires one', async () => {
    const device = makeDevice();
    const pool = new RasterReadbackPool();
    for (const byteLength of [4, 256, 256]) {
      const batch = pool.createBatch();
      const result = batch.readPixel(makeTexture(device, undefined, byteLength), region);
      batch.submit();
      await result;
    }
    expect(device.createBuffer).toHaveBeenCalledTimes(2);
    expect(device.createBuffer).toHaveBeenLastCalledWith(
      expect.objectContaining({ byteLength: 256 }),
    );
    pool.destroy();
  });

  it('keeps buffers and fences separate for different devices', async () => {
    const firstDevice = makeDevice();
    const secondDevice = makeDevice();
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const first = batch.readPixel(makeTexture(firstDevice), region);
    const second = batch.readPixel(makeTexture(secondDevice), region);
    batch.submit();
    await Promise.all([first, second]);
    expect(firstDevice.gl.fenceSync).toHaveBeenCalledOnce();
    expect(secondDevice.gl.fenceSync).toHaveBeenCalledOnce();
    expect(firstDevice.gl.flush).toHaveBeenCalledOnce();
    expect(secondDevice.gl.flush).toHaveBeenCalledOnce();
    expect(firstDevice.createBuffer).toHaveBeenCalledOnce();
    expect(secondDevice.createBuffer).toHaveBeenCalledOnce();
    pool.destroy();
  });

  it('discards buffers after a copy fails while allowing other reads to finish', async () => {
    const device = makeDevice();
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const texture = makeTexture(device);
    vi.mocked(texture.readBuffer).mockImplementationOnce(() => {
      throw new Error('copy failed');
    });
    const failed = batch.readPixel(texture, region);
    const success = batch.readPixel(makeTexture(device), region);
    const results = Promise.allSettled([failed, success]);
    batch.submit();
    expect((await results).map((result) => result.status)).toEqual(['rejected', 'fulfilled']);
    expect(device.createBuffer.mock.results[0].value.destroy).toHaveBeenCalledOnce();
    expect(device.createBuffer.mock.results[1].value.destroy).not.toHaveBeenCalled();
    pool.destroy();
  });

  it('rejects every read and discards their buffers when creating the shared fence fails', async () => {
    const device = makeDevice();
    device.gl.fenceSync.mockReturnValueOnce(null);
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const results = Promise.allSettled([
      batch.readPixel(makeTexture(device), region),
      batch.readPixel(makeTexture(device), region),
    ]);
    batch.submit();
    expect((await results).map((result) => result.status)).toEqual(['rejected', 'rejected']);
    device.createBuffer.mock.results.forEach(({ value }) => {
      expect(value.readAsync).not.toHaveBeenCalled();
      expect(value.destroy).toHaveBeenCalledOnce();
    });
    const nextBatch = pool.createBatch();
    const nextRead = nextBatch.readPixel(makeTexture(device), region);
    nextBatch.submit();
    await nextRead;
    expect(device.createBuffer).toHaveBeenCalledTimes(3);
    pool.destroy();
  });

  it('discards a buffer if CPU readback fails', async () => {
    const device = makeDevice();
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const result = batch.readPixel(makeTexture(device), region);
    const buffer = device.createBuffer.mock.results[0].value;
    buffer.readAsync.mockRejectedValueOnce(new Error('read failed'));
    batch.submit();
    await expect(result).rejects.toThrow('read failed');
    expect(buffer.destroy).toHaveBeenCalledOnce();
    pool.destroy();
  });

  it('restores the binding and destroys the buffer if readback allocation fails', async () => {
    const device = makeDevice();
    const previousBinding = {};
    device.gl.getParameter.mockReturnValue(previousBinding);
    device.gl.bufferData.mockImplementationOnce(() => {
      throw new Error('allocation failed');
    });
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const result = batch.readPixel(makeTexture(device), region);
    batch.submit();
    await expect(result).rejects.toThrow('allocation failed');
    expect(device.gl.bindBuffer).toHaveBeenLastCalledWith(
      device.gl.PIXEL_PACK_BUFFER,
      previousBinding,
    );
    expect(device.createBuffer.mock.results[0].value.destroy).toHaveBeenCalledOnce();
    expect(device.gl.fenceSync).not.toHaveBeenCalled();
    pool.destroy();
  });

  it('cancels pending fence waits and releases buffers when the pool is destroyed', async () => {
    vi.useFakeTimers();
    const device = makeDevice();
    device.gl.clientWaitSync.mockReturnValue(GL.TIMEOUT_EXPIRED);
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const result = batch.readPixel(makeTexture(device), region);
    const buffer = device.createBuffer.mock.results[0].value;
    batch.submit();
    pool.destroy();
    expect(buffer.destroy).not.toHaveBeenCalled();
    await expect(result).rejects.toThrow('pool destroyed');
    expect(buffer.destroy).toHaveBeenCalledOnce();
    expect(device.gl.deleteSync).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['WAIT_FAILED', 'context loss event', 'context loss without an event', 'poll exception'])(
    'stops polling and rejects every read on %s',
    async (failure) => {
      vi.useFakeTimers();
      const device = makeDevice();
      device.gl.clientWaitSync.mockReturnValue(GL.TIMEOUT_EXPIRED);
      const removeListener = vi.spyOn(device.gl.canvas, 'removeEventListener');
      const pool = new RasterReadbackPool();
      const batch = pool.createBatch();
      const results = Promise.allSettled([
        batch.readPixel(makeTexture(device), region),
        batch.readPixel(makeTexture(device), region),
      ]);
      batch.submit();
      expect(vi.getTimerCount()).toBe(1);

      if (failure === 'WAIT_FAILED') {
        device.gl.clientWaitSync.mockReturnValue(GL.WAIT_FAILED);
      } else if (failure === 'poll exception') {
        device.gl.clientWaitSync.mockImplementationOnce(() => {
          throw new Error('poll failed');
        });
      } else {
        device.gl.isContextLost.mockReturnValue(true);
        if (failure === 'context loss event') {
          device.gl.canvas.dispatchEvent(new Event('webglcontextlost'));
        }
      }
      if (failure !== 'context loss event') await vi.advanceTimersByTimeAsync(1);
      const settled = await results;
      expect(settled.map((result) => result.status)).toEqual(['rejected', 'rejected']);
      for (const result of settled) {
        if (result.status === 'rejected') {
          expect(result.reason.message).toMatch(/wait failed|context lost|poll failed/);
        }
      }
      expect(device.gl.deleteSync).toHaveBeenCalledOnce();
      expect(removeListener).toHaveBeenCalledWith('webglcontextlost', expect.any(Function));
      expect(vi.getTimerCount()).toBe(0);
      device.createBuffer.mock.results.forEach(({ value }) => {
        expect(value.readAsync).not.toHaveBeenCalled();
        expect(value.destroy).toHaveBeenCalledOnce();
      });
      const polls = device.gl.clientWaitSync.mock.calls.length;
      await vi.advanceTimersByTimeAsync(10);
      expect(device.gl.clientWaitSync).toHaveBeenCalledTimes(polls);

      // A later batch can proceed after the error or context restoration.
      device.gl.isContextLost.mockReturnValue(false);
      device.gl.clientWaitSync.mockReturnValue(GL.ALREADY_SIGNALED);
      const nextBatch = pool.createBatch();
      const nextRead = nextBatch.readPixel(makeTexture(device), region);
      nextBatch.submit();
      await expect(nextRead).resolves.toEqual(new Uint8Array([1, 2, 3, 255]));
      expect(device.createBuffer).toHaveBeenCalledTimes(3);
      pool.destroy();
    },
  );

  it('rejects an already lost context and discards its idle buffers', async () => {
    const device = makeDevice();
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const first = batch.readPixel(makeTexture(device), region);
    batch.submit();
    await first;
    device.gl.isContextLost.mockReturnValue(true);
    const lostBatch = pool.createBatch();
    const lostRead = lostBatch.readPixel(makeTexture(device), region);
    lostBatch.submit();
    await expect(lostRead).rejects.toThrow('context lost');
    expect(device.createBuffer.mock.results[0].value.destroy).toHaveBeenCalledOnce();
    expect(device.gl.fenceSync).toHaveBeenCalledOnce();
    pool.destroy();
  });

  it('cleans up the sync if flushing fails', async () => {
    const device = makeDevice();
    device.gl.flush.mockImplementationOnce(() => {
      throw new Error('flush failed');
    });
    const pool = new RasterReadbackPool();
    const batch = pool.createBatch();
    const result = batch.readPixel(makeTexture(device), region);
    batch.submit();
    await expect(result).rejects.toThrow('flush failed');
    expect(device.gl.deleteSync).toHaveBeenCalledOnce();
    expect(device.createBuffer.mock.results[0].value.destroy).toHaveBeenCalledOnce();
    pool.destroy();
  });

  it('reuses WebGPU buffers without inserting WebGL fences or flushes', async () => {
    const device = makeDevice('webgpu');
    const pool = new RasterReadbackPool();
    for (let index = 0; index < 2; index++) {
      const batch = pool.createBatch();
      const result = batch.readPixel(makeTexture(device), region);
      batch.submit();
      await result;
    }
    expect(device.createBuffer).toHaveBeenCalledOnce();
    expect(device.gl.fenceSync).not.toHaveBeenCalled();
    expect(device.gl.flush).not.toHaveBeenCalled();
    expect(device.gl.bufferData).not.toHaveBeenCalled();
    pool.destroy();
  });
});
