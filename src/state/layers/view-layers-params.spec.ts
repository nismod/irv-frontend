import { createStore, type WritableAtom } from 'jotai';
import { describe, expect, it, vi } from 'vitest';

import { hoverAtomFamily } from '@/lib/data-map/interactions/interaction-state';
import type { InteractionTarget } from '@/lib/data-map/interactions/types';
import type { ViewLayer } from '@/lib/data-map/view-layers';

import { viewLayersAtom } from './view-layers';
import { viewLayersParamsAtom } from './view-layers-params';

vi.mock('./view-layers', async () => {
  const { atom } = await import('jotai');
  return { viewLayersAtom: atom([]) };
});

const power: ViewLayer = { id: 'power', interactionGroup: 'assets', fn: () => null };
const roads: ViewLayer = { id: 'roads', interactionGroup: 'assets', fn: () => null };
const background: ViewLayer = { id: 'background', fn: () => null };

function setup() {
  const store = createStore();
  store.set(viewLayersAtom as WritableAtom<ViewLayer[], [ViewLayer[]], void>, [
    power,
    roads,
    background,
  ]);
  return store;
}

function hover(viewLayer: ViewLayer, id: number | string): InteractionTarget {
  return { viewLayer, deckLayerId: viewLayer.id, target: { feature: { id } } };
}

describe('hover layer parameters', () => {
  it('routes hover IDs to their own view layers and clears them on leave', () => {
    const store = setup();
    store.set(hoverAtomFamily('assets'), [hover(power, 0), hover(roads, 'road-a')]);
    const params = store.get(viewLayersParamsAtom);
    expect(params.power.hoveredFeatureId).toBe(0);
    expect(params.roads.hoveredFeatureId).toBe('road-a');
    expect(params.background.hoveredFeatureId).toBeUndefined();

    store.set(hoverAtomFamily('assets'), []);
    expect(store.get(viewLayersParamsAtom).power.hoveredFeatureId).toBeUndefined();
    expect(store.get(viewLayersParamsAtom).roads.hoveredFeatureId).toBeUndefined();
  });

  it('keeps layer parameters stable while the pointer stays on the same feature', () => {
    const store = setup();
    const changed = vi.fn();
    const unsubscribe = store.sub(viewLayersParamsAtom, changed);
    store.set(hoverAtomFamily('assets'), [hover(power, 1)]);
    const params = store.get(viewLayersParamsAtom);
    changed.mockClear();

    store.set(hoverAtomFamily('assets'), [hover(power, 1)]);
    expect(store.get(viewLayersParamsAtom)).toBe(params);
    expect(changed).not.toHaveBeenCalled();

    store.set(hoverAtomFamily('assets'), [hover(power, 2)]);
    expect(store.get(viewLayersParamsAtom).power.hoveredFeatureId).toBe(2);
    expect(changed).toHaveBeenCalledOnce();
    unsubscribe();
  });
});
