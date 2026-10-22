import type { PickingInfo } from 'deck.gl';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ViewLayer } from '@/lib/data-map/view-layers';

import { processPicked } from './process-picked';
import { makeReadbackDevice } from './raster-readback-test-utils';

const viewLayer = { id: 'raster' } as ViewLayer;
const lookup = () => viewLayer.id;

function makeRasterPick(color = [10, 20, 30, 255], type = 'webgl') {
  const buffer = {
    handle: {},
    byteLength: 8,
    readAsync: vi.fn().mockResolvedValue(new Uint8Array([...color, 0, 0, 0, 0])),
    destroy: vi.fn(),
  };
  const device = makeReadbackDevice(type);
  device.createBuffer.mockReturnValue(buffer);
  const texture = {
    device,
    computeMemoryLayout: vi.fn(() => ({ byteLength: 8 })),
    readBuffer: vi.fn(),
  };
  const info = {
    layer: { id: 'bitmap', context: { device } },
    sourceLayer: { props: { image: texture } },
    bitmap: { pixel: [12, 34] },
  } as unknown as PickingInfo;
  return { info, buffer, device, texture };
}

describe('processPicked', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('waits for GPU completion before reading a raster pixel and releases resources', async () => {
    vi.useFakeTimers();
    const { info, device, buffer, texture } = makeRasterPick();
    device.gl.clientWaitSync.mockReturnValue(device.gl.TIMEOUT_EXPIRED);

    const result = processPicked(info, 'raster', 'hazards', { raster: viewLayer }, lookup);
    expect(texture.readBuffer).toHaveBeenCalledWith({ x: 12, y: 34, width: 1, height: 1 }, buffer);
    expect(buffer.readAsync).not.toHaveBeenCalled();
    expect(buffer.destroy).not.toHaveBeenCalled();

    device.gl.clientWaitSync.mockReturnValue(device.gl.CONDITION_SATISFIED);
    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toEqual({
      interactionGroup: 'hazards',
      interactionStyle: 'raster',
      viewLayer,
      deckLayerId: 'bitmap',
      target: { color: [10, 20, 30, 255] },
    });
    expect(device.gl.deleteSync).toHaveBeenCalledOnce();
    expect(buffer.destroy).toHaveBeenCalledOnce();
  });

  it('ignores transparent raster pixels', async () => {
    const { info } = makeRasterPick([10, 20, 30, 0]);
    await expect(
      processPicked(info, 'raster', 'hazards', { raster: viewLayer }, lookup),
    ).resolves.toBeNull();
  });

  it('releases resources if readback fails', async () => {
    const { info, buffer, device } = makeRasterPick();
    buffer.readAsync.mockRejectedValue(new Error('readback failed'));
    await expect(
      processPicked(info, 'raster', 'hazards', { raster: viewLayer }, lookup),
    ).rejects.toThrow('readback failed');
    expect(device.gl.deleteSync).toHaveBeenCalledOnce();
    expect(buffer.destroy).toHaveBeenCalledOnce();
  });

  it('releases the buffer if the GPU copy fails', async () => {
    const { info, buffer, texture } = makeRasterPick();
    texture.readBuffer.mockImplementation(() => {
      throw new Error('copy failed');
    });
    await expect(
      processPicked(info, 'raster', 'hazards', { raster: viewLayer }, lookup),
    ).rejects.toThrow('copy failed');
    expect(buffer.destroy).toHaveBeenCalledOnce();
  });

  it('uses native asynchronous buffer readback on WebGPU', async () => {
    const { info, device } = makeRasterPick(undefined, 'webgpu');
    await expect(
      processPicked(info, 'raster', 'hazards', { raster: viewLayer }, lookup),
    ).resolves.toMatchObject({ target: { color: [10, 20, 30, 255] } });
    expect(device.gl.fenceSync).not.toHaveBeenCalled();
  });

  it('returns no target without bitmap coordinates', async () => {
    const { info, device } = makeRasterPick();
    delete (info as any).bitmap;
    await expect(
      processPicked(info, 'raster', 'hazards', { raster: viewLayer }, lookup),
    ).resolves.toBeNull();
    expect(device.createBuffer).not.toHaveBeenCalled();
  });

  it('continues to enrich vector picks', async () => {
    const object = { id: 'road' };
    const info = { layer: { id: 'roads' }, object } as unknown as PickingInfo;
    await expect(
      processPicked(info, 'vector', 'assets', { raster: viewLayer }, lookup),
    ).resolves.toMatchObject({ target: { feature: object }, viewLayer, deckLayerId: 'roads' });
  });
});
