import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';
import { RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { makeValueFormat } from '@/lib/formats';

import { SOURCES } from '../sources';

export const COLOR_MAP: RasterContinuousColorMap = {
  type: 'continuous',
  scheme: 'RdYlGn',
  range: [0, 1],
  // HDI should always be 0-1. "False" prevents showing >1 on rounding (e.g., Zurich)
  rangeTruncated: [false, false],
};

function getDataUrl() {
  return SOURCES.raster.getUrl({
    path: 'social/hdi',
    ...COLOR_MAP,
  });
}

export function hdiGridViewLayer(): ViewLayer {
  const label = 'Human Development Index';
  const formatValue = makeValueFormat((x) => x, { maximumFractionDigits: 2 });

  return {
    id: 'hdi-grid',
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
          data: getDataUrl(),
          refinementStrategy: 'no-overlap',
        },
      );
    },
    renderLegend() {
      return React.createElement(RasterLegend, {
        key: 'hdi-grid',
        label,
        colorMap: COLOR_MAP,
        getValueLabel: formatValue,
      });
    },
    renderTooltip(hoveredObject: InteractionTarget<RasterTarget>) {
      const { color } = hoveredObject.target;
      return React.createElement(RasterHoverDescription, {
        color,
        colorMap: COLOR_MAP,
        label,
        formatValue,
      });
    },
  };
}
