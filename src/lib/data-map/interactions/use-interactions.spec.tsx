/* @vitest-environment jsdom */

import type { MapLibreOverlay } from '@deck.gl/maplibre';
import { createStore, Provider } from 'jotai';
import { act, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ViewLayer } from '../view-layers';
import { hoverAtomFamily, hoverPositionAtom, selectionAtomFamily } from './interaction-state';
import { processPicked } from './process-picked';
import { RasterReadbackBatch } from './raster-readback';
import type { InteractionGroupConfig, InteractionTarget } from './types';
import { useInteractions } from './use-interactions';

vi.mock('./process-picked', () => ({ processPicked: vi.fn() }));

const viewLayers = [{ id: 'raster', interactionGroup: 'hazards' }] as ViewLayer[];
const groups: InteractionGroupConfig[] = [{ id: 'hazards', type: 'raster', pickMultiple: true }];
const lookup = (deckLayerId: string) => deckLayerId.split('@')[0];
const event = { x: 10, y: 20, coordinate: [1, 2] };
const target = {
  viewLayer: viewLayers[0],
  deckLayerId: 'bitmap',
  target: { color: [1, 2, 3, 255] },
};

function deferredTarget() {
  let resolve: (value: InteractionTarget) => void;
  const promise = new Promise<InteractionTarget>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

describe('asynchronous interactions', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let store: ReturnType<typeof createStore>;
  let handlers: ReturnType<typeof useInteractions>;
  let deck: MapLibreOverlay;

  function Harness({ layers = viewLayers, config = groups }) {
    handlers = useInteractions(layers, lookup, config);
    return null;
  }

  beforeAll(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  });
  beforeEach(() => {
    vi.resetAllMocks();
    container = document.createElement('div');
    root = createRoot(container);
    store = createStore();
    deck = {
      pickMultipleObjects: vi.fn(() => [{}]),
      pickObject: vi.fn(() => ({})),
    } as unknown as MapLibreOverlay;
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness />
        </Provider>,
      );
    });
  });
  afterEach(() => {
    act(() => root.unmount());
  });

  it('runs one batch at a time and keeps only the latest pending hover', async () => {
    const earlier = deferredTarget();
    vi.mocked(processPicked)
      .mockReturnValueOnce(earlier.promise as any)
      .mockResolvedValueOnce(target as any);
    const first = handlers.onHover(event, deck);
    const second = handlers.onHover({ ...event, x: 20, coordinate: [3, 4] }, deck);
    const latest = handlers.onHover({ ...event, x: 30, coordinate: [5, 6] }, deck);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(1);
    expect(processPicked).toHaveBeenCalledTimes(1);
    expect(store.get(hoverPositionAtom)).toEqual({ lng: 5, lat: 6 });
    earlier.resolve({ ...target, target: { color: [99, 99, 99, 255] } });
    await Promise.all([first, second, latest]);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(2);
    expect(deck.pickMultipleObjects).toHaveBeenLastCalledWith({
      x: 30,
      y: 20,
      layerIds: ['raster'],
      radius: undefined,
    });
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([target]);
    expect(store.get(hoverPositionAtom)).toEqual({ lng: 5, lat: 6 });
  });

  it('does not restore an old hover after the pointer leaves picked objects', async () => {
    const pending = deferredTarget();
    vi.mocked(processPicked).mockReturnValueOnce(pending.promise as any);
    const first = handlers.onHover(event, deck);
    vi.mocked(deck.pickMultipleObjects).mockReturnValue([]);
    const leave = handlers.onHover({ x: -1, y: -1 }, deck);
    pending.resolve(target);
    await Promise.all([first, leave]);
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([]);
    expect(store.get(hoverPositionAtom)).toBeNull();
  });

  it('discards pending results after layers change', async () => {
    const pending = deferredTarget();
    vi.mocked(processPicked).mockReturnValueOnce(pending.promise as any);
    const hover = handlers.onHover(event, deck);
    const queued = handlers.onHover({ ...event, x: 20 }, deck);
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness layers={[]} />
        </Provider>,
      );
    });
    pending.resolve(target);
    await Promise.all([hover, queued]);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(1);
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([]);
  });

  it('drops queued work when the map unmounts', async () => {
    const pending = deferredTarget();
    vi.mocked(processPicked).mockReturnValueOnce(pending.promise as any);
    const hover = handlers.onHover(event, deck);
    const queued = handlers.onHover({ ...event, x: 20 }, deck);
    act(() => root.render(null));
    pending.resolve(target);
    await Promise.all([hover, queued]);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(1);
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([]);
  });

  it('keeps a batch in flight across configuration changes', async () => {
    const pending = deferredTarget();
    vi.mocked(processPicked)
      .mockReturnValueOnce(pending.promise as any)
      .mockResolvedValueOnce(target as any);
    const hover = handlers.onHover(event, deck);
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness config={[...groups]} />
        </Provider>,
      );
    });
    const queued = handlers.onHover({ ...event, x: 20 }, deck);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(1);
    pending.resolve(target);
    await Promise.all([hover, queued]);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(2);
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([target]);
  });

  it('waits for every interaction group before starting the next batch', async () => {
    const pending = deferredTarget();
    const layers = [...viewLayers, { id: 'other', interactionGroup: 'assets' }] as ViewLayer[];
    const config: InteractionGroupConfig[] = [
      ...groups,
      { id: 'assets', type: 'raster', pickMultiple: true },
    ];
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness layers={layers} config={config} />
        </Provider>,
      );
    });
    vi.mocked(processPicked)
      .mockResolvedValue(target as any)
      .mockResolvedValueOnce(target as any)
      .mockReturnValueOnce(pending.promise as any);
    const hover = handlers.onHover(event, deck);
    const queued = handlers.onHover({ ...event, x: 20 }, deck);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(2);
    pending.resolve(target);
    await Promise.all([hover, queued]);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(4);
  });

  it('waits for all readbacks after a failure before starting queued work', async () => {
    const pending = deferredTarget();
    vi.mocked(deck.pickMultipleObjects)
      .mockReturnValueOnce([{}, {}] as any)
      .mockReturnValueOnce([]);
    vi.mocked(processPicked)
      .mockRejectedValueOnce(new Error('readback failed'))
      .mockReturnValueOnce(pending.promise as any);
    const hover = handlers.onHover(event, deck);
    const queued = handlers.onHover({ ...event, x: 20 }, deck);
    // Let the rejected readback propagate while its sibling is still pending.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(1);
    pending.resolve(target);
    await Promise.all([hover, queued]);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(2);
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([]);
  });

  it('clears hover and handles readback errors', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(processPicked).mockRejectedValueOnce(new Error('readback failed'));
    await handlers.onHover(event, deck);
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([]);
    expect(warning).toHaveBeenCalledOnce();
    warning.mockRestore();
  });

  it('resolves all picked targets in their original order', async () => {
    const pending = deferredTarget();
    const other = { ...target, deckLayerId: 'other' };
    vi.mocked(deck.pickMultipleObjects).mockReturnValue([{}, {}] as any);
    vi.mocked(processPicked)
      .mockReturnValueOnce(pending.promise as any)
      .mockResolvedValueOnce(other as any);
    const hover = handlers.onHover(event, deck);
    pending.resolve(target);
    await hover;
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([target, other]);
  });

  it('starts a new batch after the queue becomes idle', async () => {
    vi.mocked(processPicked).mockResolvedValue(target as any);
    await handlers.onHover(event, deck);
    await handlers.onHover({ ...event, x: 20 }, deck);
    expect(deck.pickMultipleObjects).toHaveBeenCalledTimes(2);
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([target]);
  });

  it.each(['vector', 'raster'] as const)(
    'reuses a matching single %s hover result',
    async (type) => {
      const config: InteractionGroupConfig[] = [{ id: 'hazards', type, pickingRadius: 0 }];
      act(() => {
        root.render(
          <Provider store={store}>
            <Harness config={config} />
          </Provider>,
        );
      });
      const picked = {
        ...event,
        picked: true,
        layer: { id: 'raster@bitmap' },
        bitmap: { pixel: [1, 2] },
      };
      vi.mocked(processPicked).mockResolvedValueOnce(target as any);
      await handlers.onHover(picked, deck);
      expect(deck.pickObject).not.toHaveBeenCalled();
      expect(deck.pickMultipleObjects).not.toHaveBeenCalled();
      expect(processPicked).toHaveBeenCalledWith(
        picked,
        type,
        'hazards',
        { raster: viewLayers[0] },
        lookup,
        expect.any(RasterReadbackBatch),
      );
      expect(store.get(hoverAtomFamily('hazards'))).toEqual([target]);
    },
  );

  it('still queries multiple targets when the automatic hover finds one of them', async () => {
    const config: InteractionGroupConfig[] = [{ ...groups[0], pickingRadius: 0 }];
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness config={config} />
        </Provider>,
      );
    });
    vi.mocked(processPicked).mockResolvedValue(target as any);
    await handlers.onHover({ ...event, picked: true, layer: { id: 'raster@bitmap' } }, deck);
    expect(deck.pickMultipleObjects).toHaveBeenCalledOnce();
  });

  it('repicks a matching layer when the group radius differs from automatic hover', async () => {
    // Unspecified query radius is 0, while automatic hover defaults to 8.
    const config: InteractionGroupConfig[] = [{ id: 'hazards', type: 'vector' }];
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness config={config} />
        </Provider>,
      );
    });
    vi.mocked(processPicked).mockResolvedValueOnce(target as any);
    await handlers.onHover({ ...event, picked: true, layer: { id: 'raster@bitmap' } }, deck);
    expect(deck.pickObject).toHaveBeenCalledOnce();
    expect(deck.pickObject).toHaveBeenCalledWith({
      x: 10,
      y: 20,
      layerIds: ['raster'],
      radius: undefined,
    });
  });

  it('repicks other groups that may be hidden underneath the automatic hover target', async () => {
    const layers = [...viewLayers, { id: 'other', interactionGroup: 'assets' }] as ViewLayer[];
    const config: InteractionGroupConfig[] = [
      { id: 'assets', type: 'vector', pickingRadius: 8 },
      { id: 'hazards', type: 'vector', pickingRadius: 8, usesAutoHighlight: true },
    ];
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness layers={layers} config={config} />
        </Provider>,
      );
    });
    vi.mocked(processPicked).mockResolvedValue(target as any);
    await handlers.onHover({ ...event, picked: true, layer: { id: 'other@features' } }, deck);
    expect(deck.pickObject).toHaveBeenCalledOnce();
    expect(deck.pickObject).toHaveBeenCalledWith({ x: 10, y: 20, layerIds: ['raster'], radius: 8 });
  });

  it('skips covered groups after an automatic hover miss, but queries excluded or wider groups', async () => {
    const layers = [
      ...viewLayers,
      { id: 'other', interactionGroup: 'assets' },
      { id: 'wide', interactionGroup: 'wide' },
    ] as ViewLayer[];
    const config: InteractionGroupConfig[] = [
      { id: 'assets', type: 'vector', pickingRadius: 8 },
      { id: 'hazards', type: 'raster', pickMultiple: true },
      { id: 'wide', type: 'vector', pickingRadius: 12, usesAutoHighlight: true },
    ];
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness layers={layers} config={config} />
        </Provider>,
      );
    });
    vi.mocked(processPicked).mockResolvedValue(target as any);
    await handlers.onHover({ ...event, picked: false, layer: null }, deck);
    expect(deck.pickObject).toHaveBeenCalledOnce();
    expect(deck.pickObject).toHaveBeenCalledWith({ x: 10, y: 20, layerIds: ['wide'], radius: 12 });
    expect(deck.pickMultipleObjects).toHaveBeenCalledOnce();
    expect(store.get(hoverAtomFamily('assets'))).toEqual([]);
  });

  it('clears covered multiple-target groups without repicking after an automatic hover miss', async () => {
    store.set(hoverAtomFamily('hazards'), [target]);
    await handlers.onHover({ ...event, picked: false, layer: null }, deck);
    expect(deck.pickMultipleObjects).not.toHaveBeenCalled();
    expect(deck.pickObject).not.toHaveBeenCalled();
    expect(processPicked).not.toHaveBeenCalled();
    expect(store.get(hoverAtomFamily('hazards'))).toEqual([]);
  });

  it('awaits vector selection and respects deselectOnClickEmpty', async () => {
    const config: InteractionGroupConfig[] = [
      { id: 'hazards', type: 'vector', deselectOnClickEmpty: false },
    ];
    act(() => {
      root.render(
        <Provider store={store}>
          <Harness config={config} />
        </Provider>,
      );
    });
    vi.mocked(processPicked).mockResolvedValueOnce(target as any);
    await handlers.onClick(event, deck);
    expect(store.get(selectionAtomFamily('hazards'))).toEqual(target);
    vi.mocked(deck.pickObject).mockReturnValue(null);
    await handlers.onClick(event, deck);
    expect(store.get(selectionAtomFamily('hazards'))).toEqual(target);
  });

  it('shares readback resources across groups and batches and destroys them on unmount', async () => {
    const actual = await vi.importActual<typeof import('./process-picked')>('./process-picked');
    vi.mocked(processPicked).mockImplementation(actual.processPicked);
    const device = {
      type: 'webgl',
      gl: { getParameter: vi.fn(), bindBuffer: vi.fn(), bufferData: vi.fn(), flush: vi.fn() },
      createFence: vi.fn(() => ({ signaled: Promise.resolve(), destroy: vi.fn() })),
      createBuffer: vi.fn(({ byteLength }) => ({
        byteLength,
        readAsync: vi.fn().mockResolvedValue(new Uint8Array([10, 20, 30, 255])),
        destroy: vi.fn(),
      })),
    };
    const picks = Object.fromEntries(
      ['raster', 'other'].map((id) => [
        id,
        {
          layer: { id: `${id}@bitmap`, context: { device } },
          sourceLayer: {
            props: {
              image: {
                device,
                computeMemoryLayout: () => ({ byteLength: 4 }),
                readBuffer: vi.fn(),
              },
            },
          },
          bitmap: { pixel: [1, 2] },
        },
      ]),
    );
    vi.mocked(deck.pickMultipleObjects).mockImplementation(({ layerIds }) => [
      picks[layerIds[0]] as any,
    ]);
    const layers = [...viewLayers, { id: 'other', interactionGroup: 'assets' }] as ViewLayer[];
    const config: InteractionGroupConfig[] = [
      ...groups,
      { id: 'assets', type: 'raster', pickMultiple: true },
    ];
    act(() => {
      root.render(
        <StrictMode>
          <Provider store={store}>
            <Harness layers={layers} config={config} />
          </Provider>
        </StrictMode>,
      );
    });

    await handlers.onHover(event, deck);
    expect(device.createBuffer).toHaveBeenCalledTimes(2);
    expect(device.createFence).toHaveBeenCalledOnce();
    expect(device.gl.flush).toHaveBeenCalledOnce();
    expect(store.get(hoverAtomFamily('hazards'))[0].target.color).toEqual([10, 20, 30, 255]);
    expect(store.get(hoverAtomFamily('assets'))[0].target.color).toEqual([10, 20, 30, 255]);

    await handlers.onHover({ ...event, x: 20 }, deck);
    expect(device.createBuffer).toHaveBeenCalledTimes(2);
    expect(device.createFence).toHaveBeenCalledTimes(2);
    expect(device.gl.flush).toHaveBeenCalledTimes(2);
    device.createBuffer.mock.results.forEach(({ value }) =>
      expect(value.destroy).not.toHaveBeenCalled(),
    );
    act(() => root.render(null));
    device.createBuffer.mock.results.forEach(({ value }) =>
      expect(value.destroy).toHaveBeenCalledOnce(),
    );
  });
});
