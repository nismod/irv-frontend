import React from 'react';

import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { VectorHoverDescription } from '@/lib/data-map/tooltip/VectorHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { border, fillColor, pointRadius } from '@/lib/deck/props/style';

import { SimpleAssetDetails } from '@/details/features/asset-details';

import { makeAssetLayerFn } from '../assets/make-asset-layer-fn';
import { HealthsiteDetails } from './details';
import { HEALTHSITES_COLOR, HEALTHSITES_METADATA } from './metadata';

export function healthsitesViewLayer(): ViewLayer {
  const { label, color } = HEALTHSITES_METADATA;

  const id = 'healthsites';

  return {
    id,
    interactionGroup: 'assets',

    fn: makeAssetLayerFn({
      assetId: id,
      customLayerPropsFn: ({ zoom }) => [
        pointRadius(zoom),
        fillColor(HEALTHSITES_COLOR.deck),
        border([255, 255, 255]),
      ],
    }),

    renderTooltip: (hover: InteractionTarget<VectorTarget>) => {
      return React.createElement(VectorHoverDescription, {
        hoveredObject: hover,
        label,
        color,
        idValue: hover.target.feature.properties.osm_id,
      });
    },

    renderDetails(selection: InteractionTarget<VectorTarget>) {
      const feature = selection.target.feature;

      return React.createElement(SimpleAssetDetails, {
        label,
        color,
        feature,
        DetailsComponent: HealthsiteDetails,
      });
    },
  };
}
