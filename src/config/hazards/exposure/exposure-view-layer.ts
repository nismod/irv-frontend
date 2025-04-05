import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';
import { RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { Subset } from '@/lib/helpers';

import { HAZARDS_METADATA, HazardType } from '../metadata';
import { getHazardDataPath, getHazardDataUrl } from '../source';

export type ExposureSource = Subset<HazardType, 'extreme_heat' | 'drought'>;

export const EXPOSURE_COLOR_MAPS: Record<ExposureSource, RasterContinuousColorMap> = {
  extreme_heat: {
    type: 'continuous',
    scheme: 'gist_heat_r',
    range: [1000, 2_000_000],
    rangeTruncated: [true, true],
  },
  drought: {
    type: 'continuous',
    scheme: 'oranges',
    range: [1000, 500_000],
    rangeTruncated: [true, true],
  },
};

function numFormatWhole(nearest: number) {
  nearest = nearest ? nearest : 1;
  return (value) =>
    `${(Math.round(value / nearest) * nearest).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function exposureViewLayer(hazardType: ExposureSource, hazardParams: any): ViewLayer {
  const id = `${hazardType}_exposure`;
  const deckId = getHazardDataPath({ hazardType, hazardParams, metric: 'exposure' });

  const { label: hazardLabel } = HAZARDS_METADATA[hazardType];
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
      );
    },
    renderLegend() {
      return React.createElement(RasterLegend, {
        label,
        colorMap,
        getValueLabel: numFormatWhole(1),
      });
    },
    renderTooltip(hover: InteractionTarget<RasterTarget>) {
      return React.createElement(RasterHoverDescription, {
        colorMap,
        color: hover.target.color,
        label,
        formatValue: numFormatWhole(1000),
      });
    },
  };
}
