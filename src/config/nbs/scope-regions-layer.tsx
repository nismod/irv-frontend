import { Typography } from '@mui/material';
import { Color, GeoJsonLayerProps, MVTLayerProps } from 'deck.gl/typed';

import { css2rgba$M } from '@/lib/colors';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { geoJsonLayer, mvtLayer } from '@/lib/deck/layers/base';
import { Tileset2DCentered } from '@/lib/deck/layers/tileset-2d-centered';
import { featureFilter } from '@/lib/deck/props/feature-filter';
import { mvtSelection } from '@/lib/deck/props/mvt-selection';

import { BackgroundName } from '../basemaps';
import { SOURCES } from '../sources';
import { NBS_REGION_SCOPE_LEVEL_METADATA, NbsRegionScopeLevel } from './metadata';

const LIGHT_TEXT: Color = [240, 240, 240, 255];
const DARK_TEXT: Color = [90, 90, 90, 255];

export function scopeRegionsLayer(
  scopeRegionLevel: NbsRegionScopeLevel,
  showLabels: boolean,
  background: BackgroundName,
): ViewLayer {
  const { idProperty, nameProperty, labelMinZoom } =
    NBS_REGION_SCOPE_LEVEL_METADATA[scopeRegionLevel];

  const color = background === 'satellite' ? LIGHT_TEXT : DARK_TEXT;

  return {
    id: 'scope_regions',
    interactionGroup: 'scope_regions',
    styleParams: {},
    fn: ({ deckProps, selection }) => [
      mvtLayer<MVTLayerProps>(
        deckProps,
        {
          id: `scope_regions@${scopeRegionLevel}`,
          data: SOURCES.vector.getUrl(scopeRegionLevel),
          autoHighlight: true,
          highlightColor: [0, 0, 0, 10],
          TilesetClass: Tileset2DCentered,
          binary: false,
          uniqueIdProperty: idProperty,

          filled: true,
          getFillColor: css2rgba$M('#d7dfe3'),
          opacity: 0.3,

          stroked: true,
          getLineColor: css2rgba$M('#aaaaaa'),
          lineWidthMinPixels: 1,

          renderSubLayers: (tileProps) => [
            geoJsonLayer<GeoJsonLayerProps>(
              tileProps as any,
              featureFilter(selection?.target.feature.properties[idProperty], idProperty, true),
            ),
          ],
        },
        mvtSelection({
          selectedFeatureId: selection?.target.feature.properties[idProperty],
          uniqueIdProperty: idProperty,
          selectionFillColor: [255, 255, 255, 0],
          selectionLineColor: [40, 40, 40, 255],
        }),
      ),
      showLabels &&
        mvtLayer<MVTLayerProps>(
          // don't pass deckProps here to avoid setting interactivity
          {
            id: `scope_region_labels@${scopeRegionLevel}`,
            data: SOURCES.vector.getUrl(`${scopeRegionLevel}_points`),
            TilesetClass: Tileset2DCentered,
            binary: false,

            minZoom: labelMinZoom,

            pointType: 'text',
            getText: (f) => f.properties[nameProperty] + '',
            getTextSize: 14,
            getTextColor: color,
            textFontFamily: 'sans-serif',
            textFontWeight: 600,
            textCharacterSet: 'auto',
            // display the labels above other deck layers
            getPolygonOffset: ({ layerIndex }) => [0, -layerIndex * 100 - 2000],

            renderSubLayers: (tileProps) => [
              geoJsonLayer<GeoJsonLayerProps>(
                tileProps as any,
                featureFilter(selection?.target.feature.properties[idProperty], idProperty, true),
              ),
            ],
            updateTriggers: {
              renderSubLayers: [selection?.target, scopeRegionLevel],
            },
          },
        ),
    ],

    renderTooltip: () => (
      <Typography variant="body2">Click to view adaptations in this region</Typography>
    ),
  };
}
