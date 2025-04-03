import _ from 'lodash';
import React from 'react';

import { colorDeckToCss } from '@/lib/colors';
import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterCategoricalColorMap } from '@/lib/data-map/legend/RasterCategoricalLegend';
import { registerCategoricalColorScheme } from '@/lib/data-map/legend/use-raster-color-map-values';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { withoutAlpha } from '@/lib/deck/color';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';

import landCoverLegend from './land-cover-legend.json';

const landCoverColorMap: RasterCategoricalColorMap = {
  type: 'categorical',
  scheme: 'land_cover',
};

const landCoverColorValues = _.map(landCoverLegend, ({ color: rgba }, code) => ({
  value: parseInt(code, 10),
  color: colorDeckToCss(withoutAlpha(rgba as any)),
}));

registerCategoricalColorScheme('land_cover', landCoverColorValues);

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
      return React.createElement(RasterHoverDescription, {
        colorMap: landCoverColorMap,
        color: hover.target.color,
        label: 'Land Cover',
        formatValue: (x) => landCoverLabels[x],
      });
    },
  };
}
