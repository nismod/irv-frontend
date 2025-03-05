import { Color } from 'deck.gl';
import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterColorMap, RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { toLabelLookup } from '@/lib/helpers';

import { SOURCES } from '../sources';
import { DEM_RASTER_VALUE_LABELS, TopographyType } from './metadata';

const DEM_RASTER_FORMATS: Record<
  TopographyType,
  {
    colorMap: RasterColorMap;
    formatValue: (x: number) => string;
    transparentColor?: Color;
  }
> = {
  elevation: {
    colorMap: {
      scheme: 'gnbu',
      range: [0, 6000],
      rangeTruncated: [false, true],
    },
    formatValue: (x) =>
      `${(Math.round(x / 10) * 10).toLocaleString(undefined, { maximumFractionDigits: 0 })}m`,
  },
  slope: {
    colorMap: {
      scheme: 'bupu',
      range: [0, 90],
    },
    formatValue: (x) => `${x.toLocaleString(undefined, { maximumFractionDigits: 0 })}°`,
    transparentColor: [255, 255, 255, 0],
  },
};

const valueLabelLookup = toLabelLookup(DEM_RASTER_VALUE_LABELS);

export function topographyViewLayer(type: TopographyType): ViewLayer {
  const { colorMap, formatValue, transparentColor = [255, 255, 255, 0] } = DEM_RASTER_FORMATS[type];
  const label = `${valueLabelLookup[type]}`;

  const formatFn = (x: number) => (x != null ? formatValue(x) : '-');

  return {
    id: `topography_${type}`,
    interactionGroup: 'raster_assets',
    params: {
      type,
    },
    fn: ({ deckProps }) =>
      rasterTileLayer(
        {
          transparentColor,
        },
        deckProps,
        {
          data: SOURCES.raster.getUrl({
            path: `dem/${type}`,
            ...colorMap,
          }),
          refinementStrategy: 'no-overlap',
        },
      ),
    renderLegend: () =>
      React.createElement(RasterLegend, {
        label,
        colorMap,
        getValueLabel: formatFn,
      }),
    renderTooltip(hoveredObject: InteractionTarget<RasterTarget>) {
      return React.createElement(RasterHoverDescription, {
        colorMap,
        color: hoveredObject.target.color,
        label,
        formatValue: formatFn,
      });
    },
  };
}
