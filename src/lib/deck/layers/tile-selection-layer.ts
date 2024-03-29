import { featureFilter } from '../props/feature-filter';
import { fillColor, GetColor, strokeColor } from '../props/style';
import { geoJsonLayer } from './base';

export interface TileSelectionLayerOptions {
  selectedFeatureId: number | null;
  uniqueIdProperty?: string;
  selectionFillColor?: GetColor;
  selectionLineColor?: GetColor;
  polygonOffset?: number;
}

/**
 * A deck.gl layer to draw a selection layer for a GeoJson tile.
 * Uses data from the tile instead of loading its own data.
 * Filters the selected feature on-GPU and displays it with a different style.
 */
export function tileSelectionLayer(
  tileProps,
  {
    selectedFeatureId,
    uniqueIdProperty,
    selectionFillColor = [0, 255, 255, 255],
    selectionLineColor = [0, 255, 255, 255],
    polygonOffset = 0,
  }: TileSelectionLayerOptions,
) {
  return geoJsonLayer(
    tileProps,
    {
      id: tileProps.id + '-selection',
      pickable: false,
      getPolygonOffset: ({ layerIndex }) => [0, -layerIndex * 100 + polygonOffset],
      visible: selectedFeatureId != null,

      getLineWidth: 2,
      lineWidthUnits: 'pixels',
    },
    // use on-GPU filter extension to only show the selected feature
    featureFilter(selectedFeatureId, uniqueIdProperty),

    fillColor(selectionFillColor),
    strokeColor(selectionLineColor),
  );
}
