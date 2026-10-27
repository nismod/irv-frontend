import { DataFilterExtension, type DataFilterExtensionProps } from '@deck.gl/extensions';
import type { Feature } from 'geojson';

import { getTriggers } from '@/lib/deck/props/getters';
import type { GetColor } from '@/lib/deck/props/style';

import { geoJsonLayer } from './base';

type FeatureId = string | number;
type TileFeatures = Feature[];

const filterExtension = new DataFilterExtension({ filterSize: 1 });
const DEFAULT_HALO_COLOR: GetColor = [0, 255, 255, 127];

function featureId(feature: Feature, uniqueIdProperty?: string): FeatureId | undefined {
  return uniqueIdProperty
    ? feature.properties?.[uniqueIdProperty]
    : (feature.id ?? feature.properties?.id);
}

interface TileFilter {
  keys: Map<FeatureId, number>;
  getFilterValue: (feature: Feature) => number;
}

/** Weak keys let the indexes disappear when the tileset releases its tile data. */
const tileFilters = new WeakMap<TileFeatures, Map<string | undefined, TileFilter>>();

function getTileFilter(data: TileFeatures, uniqueIdProperty?: string) {
  let filters = tileFilters.get(data);
  if (!filters) {
    filters = new Map();
    tileFilters.set(data, filters);
  }
  let filter = filters.get(uniqueIdProperty);
  if (!filter) {
    const keys = new Map<FeatureId, number>();
    for (const feature of data) {
      const id = featureId(feature, uniqueIdProperty);
      if (id != null && !keys.has(id)) keys.set(id, keys.size);
    }
    // Compact per-tile keys avoid float32 rounding of large native IDs. All
    // fragments with the same ID receive the same key, including ID zero.
    filter = {
      keys,
      getFilterValue: (feature) => keys.get(featureId(feature, uniqueIdProperty)) ?? -1,
    };
    filters.set(uniqueIdProperty, filter);
  }
  return filter;
}

export interface TileSelectionLayerOptions {
  selectedFeatureId: FeatureId | null;
  /** Unique overlay ID; defaults to the tile ID followed by -selection. */
  id?: string;
  uniqueIdProperty?: string;
  selectionFillColor?: GetColor;
  selectionLineColor?: GetColor;
  polygonOffset?: number;
}

/**
 * Draw a targeted feature and halo using the tile's geometry and cached GPU filter.
 * Hover and selection use separate IDs while sharing the same filter attribute.
 */
export function tileSelectionLayer(
  tileProps,
  {
    selectedFeatureId,
    id = tileProps.id + '-selection',
    uniqueIdProperty,
    selectionFillColor = DEFAULT_HALO_COLOR,
    selectionLineColor = DEFAULT_HALO_COLOR,
    polygonOffset = 0,
  }: TileSelectionLayerOptions,
) {
  // Empty/failed tiles and inactive overlays need no layers or filter index.
  if (tileProps.data == null || selectedFeatureId == null || tileProps.visible === false)
    return null;

  const filter = getTileFilter(tileProps.data as TileFeatures, uniqueIdProperty);
  const key = filter.keys.get(selectedFeatureId);
  if (key == null) return null;

  const foreground = geoJsonLayer<DataFilterExtensionProps>(tileProps, {
    id,
    pickable: false,
    autoHighlight: false,
    getFilterValue: filter.getFilterValue,
    filterRange: [key, key],
    filterCategories: [],
    extensions: [filterExtension],
    // Target changes only update the range, never the cached filter attribute.
    updateTriggers: { getFilterValue: [filter.getFilterValue] },
    getPolygonOffset: ({ layerIndex }) => [0, -layerIndex * 100 + polygonOffset],
    // MapLibre's interleaved renderer supplies depthBias: 0. The pipeline
    // applies that after getPolygonOffset, resetting the legacy offset.
    // Set the bias on the pipeline itself and write the foreground depth so
    // ordinary vectors cannot cover the highlight even when drawn later.
    parameters: {
      ...tileProps.parameters,
      depthBias: -10_000,
      depthBiasSlopeScale: -10_000,
      depthWriteEnabled: true,
      depthCompare: 'less-equal',
    },
  });

  // Draw an expanded cyan stroke first, then the feature's normal style.
  // Expand both pixel limits too, so the halo remains visible when the
  // source line width is clamped at either end of its zoom range.
  const scaleFactor = 3;
  const halo = foreground.clone({
    id: id + '-halo',
    filled: true,
    stroked: false,
    getLineColor: selectionLineColor,
    getFillColor: selectionFillColor,
    lineWidthScale: foreground.props.lineWidthScale * scaleFactor,
    lineWidthMinPixels: foreground.props.lineWidthMinPixels * scaleFactor,
    lineWidthMaxPixels: foreground.props.lineWidthMaxPixels * scaleFactor,
    // Circle points use radius rather than line width. Expand their pixel
    // limits as well, otherwise clamped station markers hide the halo.
    pointRadiusScale: foreground.props.pointRadiusScale * scaleFactor,
    pointRadiusMinPixels: foreground.props.pointRadiusMinPixels * scaleFactor,
    pointRadiusMaxPixels: foreground.props.pointRadiusMaxPixels * scaleFactor,
    updateTriggers: {
      ...foreground.props.updateTriggers,
      getFillColor: getTriggers(selectionFillColor),
      getLineColor: getTriggers(selectionLineColor),
    },
    parameters: {
      ...foreground.props.parameters,
      depthBias: -9999,
      depthBiasSlopeScale: -9999,
    },
  });

  return [halo, foreground];
}
