import { Color } from 'deck.gl';
import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterColorMap, RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { numFormat, toLabelLookup } from '@/lib/helpers';

import { SOURCES } from '../sources';
import { CDDType, METRIC_VALUE_LABELS } from './metadata';

const METRIC_FORMATS: Record<
  CDDType,
  {
    colorMap: RasterColorMap;
    formatValue: (x: number) => string;
    transparentColor?: Color;
  }
> = {
  relative: {
    colorMap: {
      scheme: 'magma',
      range: [0, 1],
    },
    formatValue: (x: number) => `${numFormat(x * 100, 2)}%`,
  },
  absolute: {
    colorMap: {
      scheme: 'magma',
      range: [0, 360],
    },
    formatValue: numFormat,
    transparentColor: [255, 255, 255, 0],
  },
};

const valueLabelLookup = toLabelLookup(METRIC_VALUE_LABELS);

export function cddViewLayer(type: CDDType): ViewLayer {
  const { colorMap, formatValue, transparentColor = [255, 255, 255, 0] } = METRIC_FORMATS[type];
  const label = `${valueLabelLookup[type]}`;

  const formatFn = (x: number) => (x != null ? formatValue(x) : '-');

  return {
    id: `cdd_${type}`,
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
            path: `cdd_miranda/${type}`,
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
