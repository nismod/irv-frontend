import { Color } from 'deck.gl';
import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';
import { RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { makeValueFormat, nullFormat, type FormatFunction } from '@/lib/formats';
import { toLabelLookup } from '@/lib/helpers';

import { SOURCES } from '../sources';
import { CDDType, METRIC_VALUE_LABELS } from './metadata';

const METRIC_FORMATS: Record<
  CDDType,
  {
    colorMap: RasterContinuousColorMap;
    formatValue: FormatFunction<number>;
    transparentColor?: Color;
  }
> = {
  relative: {
    colorMap: {
      type: 'continuous',
      scheme: 'magma',
      range: [0, 1],
    },
    formatValue: makeValueFormat('_', { style: 'percent', maximumSignificantDigits: 2 }),
  },
  absolute: {
    colorMap: {
      type: 'continuous',
      scheme: 'magma',
      range: [0, 360],
    },
    formatValue: makeValueFormat('_', { maximumSignificantDigits: 3 }),
    transparentColor: [255, 255, 255, 0],
  },
};

const valueLabelLookup = toLabelLookup(METRIC_VALUE_LABELS);

export function cddViewLayer(type: CDDType): ViewLayer {
  const { colorMap, formatValue, transparentColor = [255, 255, 255, 0] } = METRIC_FORMATS[type];
  const label = `${valueLabelLookup[type]}`;

  const formatFn = nullFormat(formatValue);

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
