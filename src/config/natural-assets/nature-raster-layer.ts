import { Color } from 'deck.gl/typed';
import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterColorMap, RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { toLabelLookup } from '@/lib/helpers';

import { RasterHoverDescription } from '@/map/tooltip/RasterHoverDescription';

import { SOURCES } from '../sources';
import { NATURE_RASTER_VALUE_LABELS, NatureRasterType } from './metadata';

export const NATURE_RASTER_FORMATS: Record<
  NatureRasterType,
  {
    colorMap: RasterColorMap;
    formatValue: (x: number) => string;
    transparentColor?: Color;
  }
> = {
  biodiversity_intactness: {
    colorMap: {
      scheme: 'rdbu', //TODO - original dataset colormap has middle around 0.9
      range: [0.6, 1],
      rangeTruncated: [true, false],
    },
    formatValue: (x) => `${(x * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`,
  },
  forest_landscape_integrity: {
    colorMap: {
      scheme: 'ylgn', //TODO - original dataset colormap is more like gold-yellow-green
      range: [0, 10_000],
    },
    formatValue: (x) => `${(x / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
    transparentColor: [255, 255, 255, 0],
  },
  organic_carbon: {
    colorMap: {
      scheme: 'binary',
      range: [0, 150],
      rangeTruncated: [false, true],
    },
    formatValue: (x) => `${x.toLocaleString(undefined, { maximumFractionDigits: 1 })} t/ha`,
  },
};

const valueLabelLookup = toLabelLookup(NATURE_RASTER_VALUE_LABELS);

export function natureRasterViewLayer(type: NatureRasterType): ViewLayer {
  const { colorMap, formatValue, transparentColor = [0, 0, 0, 0] } = NATURE_RASTER_FORMATS[type];
  const label = `${valueLabelLookup[type]}`;

  const formatFn = (x: number) => (x != null ? formatValue(x) : '-');

  return {
    id: `nature_${type}`,
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
            path: `nature/${type}`,
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
