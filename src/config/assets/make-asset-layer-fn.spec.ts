import type { DataFilterExtensionProps } from '@deck.gl/extensions';
import type { GeoJsonLayer } from 'deck.gl';
import { describe, expect, it } from 'vitest';

import { makeAssetLayerFn } from './make-asset-layer-fn';

// Current vector tiles store the internal feature ID at the top level; the
// asset_id property identifies the asset in its source dataset instead.
const features = [
  { type: 'Feature', id: 65013040, properties: { asset_id: 820500 } },
  { type: 'Feature', id: 65012841, properties: { asset_id: 820301 } },
];

function createLayer(selectedFeature?: (typeof features)[number]) {
  const createAssetLayer = makeAssetLayerFn({ assetId: 'rail_nodes' });
  return createAssetLayer({
    deckProps: { id: 'rail_nodes' },
    zoom: 4,
    selection: selectedFeature ? { target: { feature: selectedFeature } } : null,
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
  it('enables cyan hover highlighting using native feature IDs', () => {
    const layer = createLayer();
    expect(layer.props.autoHighlight).toBe(true);
    expect(layer.props.highlightColor).toEqual([0, 255, 255, 255]);
    expect(layer.props.uniqueIdProperty).toBeFalsy();
  });

  it('shows a cyan selection overlay for only the selected native ID', () => {
    const selection = getSelectionLayer(createLayer(features[0]));
    expect(selection.props.visible).toBe(true);
    expect(selection.props.getFillColor).toEqual([0, 255, 255, 255]);
    const filter = selection.props.getFilterValue as (feature: object) => number;
    expect(filter(features[0])).toBe(1);
    expect(filter(features[1])).toBe(0);
  });

  it('hides the selection overlay when there is no selected feature', () => {
    expect(getSelectionLayer(createLayer()).props.visible).toBe(false);
  });
});
