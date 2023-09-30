import React from 'react';

import { StyleParams, ViewLayer } from '@/lib/data-map/view-layers';

import { VectorLegend } from '@/map/legend/VectorLegend';

import { getAssetDataFormats } from './data-formats';

/**
 * Returns the view layer legend config (render function and legend key)
 * for an asset data legend
 */
export function assetLayerLegendConfig(
  styleParams?: StyleParams,
): Pick<ViewLayer, 'renderLegend' | 'legendKey'> {
  const { colorMap } = styleParams ?? {};

  return colorMap
    ? {
        renderLegend: () => {
          const legendFormatConfig = getAssetDataFormats(colorMap.fieldSpec);

          return React.createElement(VectorLegend, {
            colorMap,
            legendFormatConfig,
          });
        },
        /**
         * Grouping key for asset legend is based on fieldGroup-field pair
         * Could need changing in the future if this grouping is not enough to distinguish between different asset legends
         */
        legendKey: `${colorMap.fieldSpec.fieldGroup}-${colorMap.fieldSpec.field}`,
      }
    : {};
}
