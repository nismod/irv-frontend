/* @vitest-environment jsdom */

import { createStore, Provider } from 'jotai';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { mapFitBoundsAtom } from '@/state/map-view/map-view-state';

import { ZoomToFeatureButton, type ZoomableFeature } from './ZoomToFeatureButton';

describe('zoom to feature', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let store: ReturnType<typeof createStore>;

  beforeAll(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    container = document.createElement('div');
    root = createRoot(container);
    store = createStore();
  });

  afterEach(() => {
    act(() => root.unmount());
  });

  function renderButton(feature: ZoomableFeature, bboxWkt?: string) {
    act(() => {
      root.render(
        <Provider store={store}>
          <ZoomToFeatureButton feature={feature} bboxWkt={bboxWkt} />
        </Provider>,
      );
    });
    return container.querySelector('button')!;
  }

  it('fits a line with a margin and allows repeated zoom requests', () => {
    const button = renderButton({
      geometry: {
        type: 'LineString',
        coordinates: [
          [-2, 50],
          [1, 52],
        ],
      },
    });
    expect(store.get(mapFitBoundsAtom)).toBeNull();
    act(() => button.click());
    const firstBounds = store.get(mapFitBoundsAtom);
    expect(firstBounds[0]).toBeLessThan(-2);
    expect(firstBounds[1]).toBeLessThan(50);
    expect(firstBounds[2]).toBeGreaterThan(1);
    expect(firstBounds[3]).toBeGreaterThan(52);

    act(() => button.click());
    expect(store.get(mapFitBoundsAtom)).toEqual(firstBounds);
    expect(store.get(mapFitBoundsAtom)).not.toBe(firstBounds);
  });

  it('gives point features finite, nonzero bounds', () => {
    const button = renderButton({ geometry: { type: 'Point', coordinates: [0, 51] } });
    act(() => button.click());
    const bounds = store.get(mapFitBoundsAtom);
    expect(bounds.every(Number.isFinite)).toBe(true);
    expect(bounds[0]).toBeLessThan(0);
    expect(bounds[1]).toBeLessThan(51);
    expect(bounds[2]).toBeGreaterThan(0);
    expect(bounds[3]).toBeGreaterThan(51);
  });

  it('prefers supplied full-feature bounds over the picked tile geometry', () => {
    const button = renderButton(
      { geometry: { type: 'Point', coordinates: [0, 51] } },
      'POLYGON((-5 48, 5 48, 5 55, -5 55, -5 48))',
    );
    act(() => button.click());
    const bounds = store.get(mapFitBoundsAtom);
    expect(bounds[0]).toBeLessThan(-5);
    expect(bounds[1]).toBeLessThan(48);
    expect(bounds[2]).toBeGreaterThan(5);
    expect(bounds[3]).toBeGreaterThan(55);
  });

  it.each<ZoomableFeature>([
    {},
    { geometry: { type: 'GeometryCollection', geometries: [] } },
    { bbox: [NaN, 0, 1, 1] },
    { properties: { bbox_wkt: 'invalid' } },
  ])('disables zoom when bounds are unavailable or invalid: %j', (feature) => {
    const button = renderButton(feature);
    expect(button.disabled).toBe(true);
    act(() => button.click());
    expect(store.get(mapFitBoundsAtom)).toBeNull();
  });
});
