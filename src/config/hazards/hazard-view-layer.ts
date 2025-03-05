import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';

import { HazardHoverDescription } from './HazardHoverDescription';
import { HazardLegend } from './HazardLegend';
import { HAZARD_COLOR_MAPS, HazardType } from './metadata';
import { getHazardDataPath, getHazardDataUrl } from './source';

export function getHazardId(hazardType: HazardType, hazardParams: any) {
  return getHazardDataPath({ hazardType, metric: 'occurrence', hazardParams });
}

export function hazardViewLayer(hazardType: string, hazardParams: any): ViewLayer {
  const isCyclone = hazardType === 'cyclone' || hazardType === 'cyclone_iris';
  const magFilter = isCyclone ? 'nearest' : 'linear';

  const id = hazardType;
  const deckId = getHazardId(hazardType as HazardType, hazardParams);

  return {
    id,
    interactionGroup: 'hazards',
    params: { hazardType, hazardParams },
    fn: ({ deckProps, zoom }) => {
      const { scheme, range } = HAZARD_COLOR_MAPS[hazardType];

      return rasterTileLayer(
        {
          textureParameters: {
            magFilter,
          },
          opacity: isCyclone ? 0.6 : 1,

          // TODO: tweak transparentColor to tweak border color / transparent layer tint

          transparentColor: [255, 255, 255, 0],
        },
        deckProps,
        {
          id: `${id}@${deckId}`, // follow the convention viewLayerId@deckLayerId
          data: getHazardDataUrl(
            { hazardType: hazardType as HazardType, metric: 'occurrence', hazardParams },
            { scheme, range },
          ),
          refinementStrategy: 'no-overlap',
        },
      );
    },
    renderLegend() {
      return React.createElement(HazardLegend, {
        key: hazardType,
        viewLayer: this,
      });
    },
    renderTooltip(hover: InteractionTarget<RasterTarget>) {
      return React.createElement(HazardHoverDescription, {
        hoveredObject: hover,
      });
    },
  };
}
