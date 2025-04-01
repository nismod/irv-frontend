import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterContinuousColorMap, RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { makeValueFormat } from '@/lib/formats';

import { SOURCES } from '../sources';

export const JRC_POPULATION_COLOR_MAP: RasterContinuousColorMap = {
  scheme: 'purd',
  range: [0, 1e4],
  rangeTruncated: [false, true],
};

function getPopulationUrl() {
  return SOURCES.raster.getUrl({
    path: 'population/2020', // default, only available epoch: 2020
    ...JRC_POPULATION_COLOR_MAP,
  });
}

export function jrcPopulationViewLayer(): ViewLayer {
  const label = 'Population Density';
  const formatValue = makeValueFormat(
    (x) => (
      <>
        {x}/km<sup>2</sup>
      </>
    ),
    { maximumFractionDigits: 1 },
  );

  return {
    id: 'population',
    interactionGroup: 'raster_assets',
    fn({ deckProps, zoom }) {
      return rasterTileLayer(
        {
          textureParameters: {
            magFilter: zoom >= 7 ? 'nearest' : 'linear',
          },
          transparentColor: [255, 255, 255, 0],
        },
        deckProps,
        {
          data: getPopulationUrl(),
          refinementStrategy: 'no-overlap',
        },
      );
    },
    renderLegend() {
      return React.createElement(RasterLegend, {
        key: 'population',
        label,
        colorMap: JRC_POPULATION_COLOR_MAP,
        getValueLabel: formatValue,
      });
    },
    renderTooltip(hoveredObject: InteractionTarget<RasterTarget>) {
      const { color } = hoveredObject.target;
      return React.createElement(RasterHoverDescription, {
        color,
        colorMap: JRC_POPULATION_COLOR_MAP,
        label,
        formatValue,
      });
    },
  };
}
