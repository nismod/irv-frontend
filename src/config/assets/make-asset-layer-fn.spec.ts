import type { DataFilterExtensionProps } from '@deck.gl/extensions';
import { ScatterplotLayer, type GeoJsonLayer } from 'deck.gl';
import { describe, expect, it } from 'vitest';

import { border, fillColor, lineStyle, pointRadius } from '@/lib/deck/props/style';

import { makeAssetLayerFn } from './make-asset-layer-fn';

// Current vector tiles store the internal feature ID at the top level; the
// asset_id property identifies the asset in its source dataset instead.
const features = [
  { type: 'Feature', id: 65013040, properties: { asset_id: 820500 } },
  { type: 'Feature', id: 65012841, properties: { asset_id: 820301 } },
];

function createLayer(selectedFeature?: (typeof features)[number], hoveredFeatureId?: number) {
  const createAssetLayer = makeAssetLayerFn({ assetId: 'rail_nodes' });
  return createAssetLayer({
    deckProps: { id: 'rail_nodes' },
    zoom: 4,
    selection: selectedFeature ? { target: { feature: selectedFeature } } : null,
    hoveredFeatureId,
  });
}

function getSelectionLayer(layer: ReturnType<typeof createLayer>) {
  const renderSubLayers = layer.props.renderSubLayers as (props: object) => unknown[];
  const sublayers = renderSubLayers({ id: 'tile', data: features }).flat(Infinity) as GeoJsonLayer<
    Record<string, unknown>,
    DataFilterExtensionProps
  >[];
  return sublayers.find((sublayer) => sublayer?.id.endsWith('-selection'))!;
}

describe('asset tile highlights', () => {
  it.each(['hover', 'selection'] as const)(
    'draws a visible halo around station circles on %s, including at radius limits',
    (mode) => {
      const stations = features.map((feature) => ({
        ...feature,
        geometry: { type: 'Point', coordinates: [0, 0] },
      }));
      const createAssetLayer = makeAssetLayerFn({
        assetId: 'rail_nodes',
        customLayerPropsFn: ({ zoom }) => [
          border(),
          fillColor([128, 64, 32, 255]),
          pointRadius(zoom),
        ],
      });
      const layer = createAssetLayer({
        deckProps: { id: 'rail_nodes' },
        zoom: 10,
        selection: mode === 'selection' ? { target: { feature: stations[0] } } : null,
        hoveredFeatureId: mode === 'hover' ? stations[0].id : undefined,
      });
      const renderSubLayers = layer.props.renderSubLayers as (props: object) => unknown[];
      const sublayers = renderSubLayers({ ...layer.props, id: 'tile', data: stations })
        .flat(Infinity)
        .filter(Boolean) as GeoJsonLayer[];

      function renderCircle(geojson: GeoJsonLayer) {
        geojson.initializeState();
        geojson.updateState({ props: geojson.props, changeFlags: { dataChanged: true } } as any);
        return [geojson.renderLayers()]
          .flat(Infinity)
          .find((sublayer) => sublayer instanceof ScatterplotLayer) as ScatterplotLayer;
      }

      const base = renderCircle(sublayers.find((sublayer) => sublayer.id === 'tile')!);
      const foreground = renderCircle(
        sublayers.find((sublayer) => sublayer.id === `tile-${mode}`)!,
      );
      const halo = renderCircle(sublayers.find((sublayer) => sublayer.id === `tile-${mode}-halo`)!);
      expect(foreground.props.getFillColor).toEqual(base.props.getFillColor);
      expect(foreground.props.getRadius).toBe(base.props.getRadius);
      expect(foreground.props.radiusScale).toBe(base.props.radiusScale);
      expect(foreground.props.radiusMinPixels).toBe(base.props.radiusMinPixels);
      expect(foreground.props.radiusMaxPixels).toBe(base.props.radiusMaxPixels);
      expect(halo.props.getFillColor).toEqual([0, 255, 255, 127]);
      expect(halo.props.filled).toBe(true);
      expect(halo.props.pickable).toBe(false);

      // Apply ScatterplotLayer's radius and outline clamps at zoom scales
      // below, within, and above the station marker's pixel limits.
      const outerRadius = (circle: ScatterplotLayer, pixelsPerMeter: number) => {
        const radius = Math.max(
          circle.props.radiusMinPixels,
          Math.min(
            (circle.props.getRadius as number) * circle.props.radiusScale * pixelsPerMeter,
            circle.props.radiusMaxPixels,
          ),
        );
        const stroke = circle.props.stroked
          ? Math.max(
              circle.props.lineWidthMinPixels,
              Math.min(
                (circle.props.getLineWidth as number) *
                  circle.props.lineWidthScale *
                  pixelsPerMeter,
                circle.props.lineWidthMaxPixels,
              ),
            )
          : 0;
        return radius + stroke / 2;
      };
      for (const pixelsPerMeter of [0.001, 0.01, 1]) {
        expect(outerRadius(halo, pixelsPerMeter)).toBeGreaterThan(
          outerRadius(foreground, pixelsPerMeter),
        );
      }
    },
  );

  it.each([0, 1, 2, 3] as const)(
    'keeps the hover line width consistent with the base feature for style level %s',
    (level) => {
      const createAssetLayer = makeAssetLayerFn({
        assetId: 'power_transmission',
        customLayerPropsFn: ({ zoom }) => [lineStyle(zoom, level)],
      });
      const layer = createAssetLayer({
        deckProps: { id: 'power_transmission' },
        zoom: 12,
        selection: null,
        hoveredFeatureId: features[0].id,
      });
      const renderSubLayers = layer.props.renderSubLayers as (props: object) => unknown[];
      const sublayers = renderSubLayers({ ...layer.props, id: 'tile', data: features }).flat(
        Infinity,
      ) as GeoJsonLayer[];
      const base = sublayers.find((sublayer) => sublayer?.id === 'tile')!;
      const hover = sublayers.find((sublayer) => sublayer?.id === 'tile-hover')!;

      expect(hover.props.visible).toBe(true);
      for (const prop of [
        'getLineWidth',
        'lineWidthUnits',
        'lineWidthScale',
        'lineWidthMinPixels',
        'lineWidthMaxPixels',
        'lineCapRounded',
        'lineJointRounded',
      ] as const) {
        expect(hover.props[prop]).toEqual(base.props[prop]);
      }
    },
  );

  it('replaces automatic highlighting with a normal-style overlay and cyan halo', () => {
    const layer = createLayer(undefined, features[0].id);
    expect(layer.props.autoHighlight).toBe(false);
    expect(layer.props.uniqueIdProperty).toBeFalsy();
    const renderSubLayers = layer.props.renderSubLayers as (props: object) => unknown[];
    const sublayers = renderSubLayers({ id: 'tile', data: features }).flat(
      Infinity,
    ) as GeoJsonLayer<Record<string, unknown>, DataFilterExtensionProps>[];
    const hover = sublayers.find((sublayer) => sublayer?.id.endsWith('-hover'))!;
    const halo = sublayers.find((sublayer) => sublayer?.id.endsWith('-hover-halo'))!;
    const base = sublayers.find((sublayer) => sublayer?.id === 'tile')!;
    expect(hover.props.pickable).toBe(false);
    expect(hover.props.visible).toBe(true);
    expect(hover.props.getFillColor).toEqual(base.props.getFillColor);
    expect(halo.props.getLineColor).toEqual([0, 255, 255, 127]);
    expect(halo.props.pickable).toBe(false);
    expect(halo.props.visible).toBe(true);
  });

  it('passes the hovered native ID through to the tile overlay', () => {
    const layer = createLayer(undefined, features[1].id);
    const renderSubLayers = layer.props.renderSubLayers as (props: object) => unknown[];
    const sublayers = renderSubLayers({ id: 'tile', data: features }).flat(
      Infinity,
    ) as GeoJsonLayer<Record<string, unknown>, DataFilterExtensionProps>[];
    const hover = sublayers.find((sublayer) => sublayer?.id.endsWith('-hover'))!;
    expect(hover.props.visible).toBe(true);
    const filter = hover.props.getFilterValue as (feature: object) => number;
    expect(hover.props.filterRange).toEqual([filter(features[1]), filter(features[1])]);
    expect(filter(features[0])).not.toBe(filter(features[1]));
  });

  it('shows a selection halo and the normal style for only the selected native ID', () => {
    const layer = createLayer(features[0]);
    const selection = getSelectionLayer(layer);
    expect(selection.props.visible).toBe(true);
    const filter = selection.props.getFilterValue as (feature: object) => number;
    expect(selection.props.filterRange).toEqual([filter(features[0]), filter(features[0])]);
    expect(filter(features[1])).not.toBe(filter(features[0]));
  });

  it('creates no selection overlay when there is no selected feature', () => {
    expect(getSelectionLayer(createLayer())).toBeUndefined();
  });

  it.each([features[0].id, features[1].id])(
    'gives simultaneous hover and selection unique parent and PathLayer IDs for hover %s',
    (hoveredFeatureId) => {
      for (const id of [hoveredFeatureId, features[1].id, features[0].id]) {
        const layer = createLayer(features[0], id);
        const renderSubLayers = layer.props.renderSubLayers as (props: object) => unknown[];
        const sublayers = renderSubLayers({ id: 'tile', data: features })
          .flat(Infinity)
          .filter(Boolean) as GeoJsonLayer[];
        const ids = sublayers.map((sublayer) => sublayer.id);
        expect(ids).toEqual([
          'tile',
          'tile-selection-halo',
          'tile-selection',
          ...(id === features[0].id ? [] : ['tile-hover-halo', 'tile-hover']),
        ]);
        expect(new Set(ids).size).toBe(ids.length);

        // Exercise deck.gl's own child ID generation, which previously produced
        // duplicate -hover-linestrings IDs and caused initialization assertions.
        const pathIds = sublayers.map((sublayer) => {
          sublayer.initializeState();
          return sublayer['getSubLayerProps']({ id: 'linestrings' }).id;
        });
        expect(new Set(pathIds).size).toBe(pathIds.length);
        const selection = sublayers.find((sublayer) => sublayer.id === 'tile-selection')!;
        const hover = sublayers.find((sublayer) => sublayer.id === 'tile-hover');
        if (hover) {
          const selectionFilter = selection.props as DataFilterExtensionProps;
          const hoverFilter = hover.props as DataFilterExtensionProps;
          expect(selectionFilter.getFilterValue).toBe(hoverFilter.getFilterValue);
        }
      }
    },
  );

  it('creates no hover or selection layers for tiles without matching features', () => {
    const layer = createLayer(features[0], features[1].id);
    const renderSubLayers = layer.props.renderSubLayers as (props: object) => unknown[];
    const sublayers = renderSubLayers({ id: 'empty-tile', data: [] })
      .flat(Infinity)
      .filter(Boolean) as GeoJsonLayer[];
    expect(sublayers.map((sublayer) => sublayer.id)).toEqual(['empty-tile']);
  });
});
