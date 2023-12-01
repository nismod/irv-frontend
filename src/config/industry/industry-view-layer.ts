import React from 'react';

import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { VectorHoverDescription } from '@/lib/data-map/tooltip/VectorHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { border, fillColor, pointRadius } from '@/lib/deck/props/style';
import { makeColorConfig, makeConfig } from '@/lib/helpers';

import { SimpleAssetDetails } from '@/details/features/asset-details';
import { IndustryType } from '@/state/data-selection/industry';

import { makeAssetLayerFn } from '../assets/make-asset-layer-fn';
import { AssetMetadata } from '../assets/metadata';
import { IndustryDetails } from './details';

export const INDUSTRY_COLORS = makeColorConfig<IndustryType>({
  cement: '#e4cda9',
  steel: '#5b8cc3',
});

export const INDUSTRY_METADATA = makeConfig<AssetMetadata & { shortLabel: string }, IndustryType>([
  {
    id: 'cement',
    type: 'circle',
    label: 'Industry (Cement)',
    shortLabel: 'Cement',
    color: INDUSTRY_COLORS.cement.css,
  },
  {
    id: 'steel',
    type: 'circle',
    label: 'Industry (Steel)',
    shortLabel: 'Steel',
    color: INDUSTRY_COLORS.steel.css,
  },
]);

export function industryViewLayer(industryType: IndustryType): ViewLayer {
  const { label, color } = INDUSTRY_METADATA[industryType];

  return {
    id: industryType,
    params: {
      industryType,
    },
    interactionGroup: 'assets',
    fn: makeAssetLayerFn({
      assetId: industryType,
      customLayerPropsFn: ({ zoom }) => [
        pointRadius(zoom, 1),
        fillColor(INDUSTRY_COLORS[industryType].deck),
        border([100, 100, 100]),
      ],
    }),
    renderTooltip: (hover: InteractionTarget<VectorTarget>) => {
      return React.createElement(VectorHoverDescription, {
        hoveredObject: hover,
        label,
        color,
        idValue: hover.target.feature.properties.uid,
      });
    },
    renderDetails(selection: InteractionTarget<VectorTarget>) {
      const feature = selection.target.feature;

      return React.createElement(SimpleAssetDetails, {
        feature,
        label,
        color,
        detailsComponent: IndustryDetails,
      });
    },
  };
}
