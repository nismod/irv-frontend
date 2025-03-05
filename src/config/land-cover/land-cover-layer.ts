import _ from 'lodash';
import React from 'react';

import { colorDeckToCss } from '@/lib/colors';
import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterBaseHover } from '@/lib/data-map/tooltip/RasterBaseHover';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { withoutAlpha } from '@/lib/deck/color';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';

import landCoverLegend from './land-cover-legend.json';

const landCoverColorMap = _.map(landCoverLegend, ({ color: rgba }, code) => ({
  value: parseInt(code, 10),
  color: colorDeckToCss(withoutAlpha(rgba as any)),
}));

const landCoverLabels = Object.fromEntries(
  _.map(landCoverLegend, ({ name }, code) => [parseInt(code, 10), name]),
);

export function landCoverViewLayer(): ViewLayer {
  return {
    id: 'land_cover',
    interactionGroup: 'raster_assets',
    fn: ({ deckProps }) =>
      rasterTileLayer(
        {
          textureParameters: {
            magFilter: 'linear',
          },
        },
        deckProps,
        {
          data: '/api/tiles/land_cover/land_cover/{z}/{x}/{y}.png?colormap=explicit',
          refinementStrategy: 'no-overlap',
        },
      ),
    renderTooltip(hover: InteractionTarget<RasterTarget>) {
      return React.createElement(RasterBaseHover, {
        colorMap: {
          colorMapValues: landCoverColorMap,
          rangeTruncated: [false, false],
        },
        color: hover.target.color,
        label: 'Land Cover',
        formatValue: (x) => landCoverLabels[x],
      });
    },
  };
}
