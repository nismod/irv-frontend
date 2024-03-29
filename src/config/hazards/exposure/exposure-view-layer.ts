import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterColorMap, RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { Subset } from '@/lib/helpers';

import { HAZARDS_METADATA, HazardType } from '../metadata';
import { getHazardDataPath, getHazardDataUrl } from '../source';

export type ExposureSource = Subset<HazardType, 'extreme_heat' | 'drought'>;

export const EXPOSURE_COLOR_MAPS: Record<ExposureSource, RasterColorMap> = {
  extreme_heat: {
    scheme: 'reds',
    range: [0, 5000],
    rangeTruncated: [false, true],
  },
  drought: {
    scheme: 'oranges',
    range: [0, 1000],
    rangeTruncated: [false, true],
  },
};

function numFormatWhole(value: number) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function exposureViewLayer(hazardType: ExposureSource, hazardParams: any): ViewLayer {
  const id = `${hazardType}_exposure`;
  const deckId = getHazardDataPath({ hazardType, hazardParams, metric: 'exposure' });

  let { label: hazardLabel } = HAZARDS_METADATA[hazardType];
  const colorMap = EXPOSURE_COLOR_MAPS[hazardType];

  const label = `Expected Annual Population Exposed (${hazardLabel})`;

  return {
    id,
    interactionGroup: 'hazards',
    params: { hazardType, hazardParams },
    fn: ({ deckProps, zoom }) => {
      return rasterTileLayer(
        {
          transparentColor: [255, 255, 255, 0],
        },
        deckProps,
        {
          id: `${id}@${deckId}`, // follow the convention viewLayerId@deckLayerId
          data: getHazardDataUrl({ hazardType, metric: 'exposure', hazardParams }, colorMap),
          refinementStrategy: 'no-overlap',
        },
        // temporarily hide EH below zoom 6 due to artifacts in data
        hazardType === 'extreme_heat' && {
          minZoom: 6,
        },
      );
    },
    renderLegend() {
      return React.createElement(RasterLegend, {
        label,
        colorMap,
        getValueLabel: numFormatWhole,
      });
    },
    renderTooltip(hover: InteractionTarget<RasterTarget>) {
      return React.createElement(RasterHoverDescription, {
        colorMap,
        color: hover.target.color,
        label,
        formatValue: numFormatWhole,
      });
    },
  };
}
