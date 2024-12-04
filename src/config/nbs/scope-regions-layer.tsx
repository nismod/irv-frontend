import { Typography } from '@mui/material';
import { GeoJsonLayerProps, MVTLayerProps } from 'deck.gl/typed';

import { css2rgba$M } from '@/lib/colors';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { geoJsonLayer, mvtLayer } from '@/lib/deck/layers/base';
import { Tileset2DCentered } from '@/lib/deck/layers/tileset-2d-centered';
import { featureFilter } from '@/lib/deck/props/feature-filter';
import { mvtSelection } from '@/lib/deck/props/mvt-selection';

import { SOURCES } from '../sources';
import { NBS_REGION_SCOPE_LEVEL_METADATA, NbsRegionScopeLevel } from './metadata';

export function scopeRegionsLayer(scopeRegionLevel: NbsRegionScopeLevel): ViewLayer {
  const idProperty = NBS_REGION_SCOPE_LEVEL_METADATA[scopeRegionLevel]?.idProperty;
  return {
    id: 'scope_regions',
    interactionGroup: 'scope_regions',
    styleParams: {},
    fn: ({ deckProps, selection }) =>
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
          opacity: 0.5,

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
        }),
      ),

    renderTooltip: () => (
      <Typography variant="body2">Click to view adaptations in this region</Typography>
    ),
  };
}
