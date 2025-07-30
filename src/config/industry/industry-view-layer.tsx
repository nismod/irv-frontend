import React from 'react';

import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { useViewLayerState } from '@/lib/data-map/react/view-layer-state';
import { VectorHoverDescription } from '@/lib/data-map/tooltip/VectorHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { border, fillColor, pointRadius } from '@/lib/deck/props/style';
import { makeColorConfig, makeConfig } from '@/lib/helpers';

import { SimpleAssetDetails } from '@/details/features/asset-details';
import { IndustryType } from '@/state/data-selection/industry';

import { makeAssetRenderMapLayers } from '../assets/make-asset-layer-fn';
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

type IndustryParams = {
  industryType: IndustryType;
};

type IndustryState = {
  hover: InteractionTarget<VectorTarget>;
  selection: InteractionTarget<VectorTarget>;
};

export function industryViewLayer(
  industryType: IndustryType,
): ViewLayer<IndustryParams, IndustryState> {
  const { label, color } = INDUSTRY_METADATA[industryType];

  return {
    type: 'new',
    id: industryType,
    params: {
      industryType,
    },
    interactions: new VectorInteractions({
      group: 'assets',
    }),
    renderMapLayers: makeAssetRenderMapLayers({
      assetId: industryType,
      customLayerPropsFn: ({ zoom }) => [
        pointRadius(zoom, 1),
        fillColor(INDUSTRY_COLORS[industryType].deck),
        border([100, 100, 100]),
      ],
    }),
    slots: {
      Tooltip: () => {
        const [{ hover }] = useViewLayerState<IndustryState>();
        return (
          <VectorHoverDescription
            hoveredObject={hover}
            label={label}
            color={color}
            idValue={hover.target.feature.properties.uid}
          />
        );
      },
      Details: () => {
        const [{ selection }, setState] = useViewLayerState<IndustryState>();
        const feature = selection.target.feature;

        /**
         * NOTE: currently the deselection button logic is based on global interaction group state,
         * but we need to somehow pass the "setState" of this view layer to the deselection button
         * so that it can clear the selection when clicked.
         */
        return (
          <SimpleAssetDetails
            feature={feature}
            label={label}
            color={color}
            DetailsComponent={IndustryDetails}
          />
        );
      },
    },
  };
}
