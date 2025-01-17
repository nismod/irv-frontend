import React from 'react';

import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { withAlpha } from '@/lib/deck/color';
import { basicMvtLayer } from '@/lib/deck/layers/basic-mvt-layer';
import { mvtSelection } from '@/lib/deck/props/mvt-selection';
import { border, fillColor, pointRadius } from '@/lib/deck/props/style';
import { toLabelLookup } from '@/lib/helpers';

import { SimpleAssetDetails } from '@/details/features/asset-details';
import { DefaultDetails } from '@/details/features/detail-components';

import { SOURCES } from '../sources';
import { PROTECTED_AREA_COLORS, PROTECTED_AREA_LABELS, ProtectedAreaType } from './metadata';

type ShapeType = 'points' | 'polygons';

const protectedAreaLabelLookup = toLabelLookup(PROTECTED_AREA_LABELS);

export function protectedAreaViewLayer(shapeType: ShapeType, type: ProtectedAreaType): ViewLayer {
  const color = PROTECTED_AREA_COLORS[type];
  const label = `Protected Areas (${protectedAreaLabelLookup[type]})`;
  const id = `wdpa_${type}_${shapeType}`;
  const uniqueIdProperty = 'WDPA_PID';

  return {
    id,
    interactionGroup: 'wdpa',
    params: {
      shapeType,
      type,
    },
    fn({ deckProps, zoom, selection }) {
      return basicMvtLayer(
        deckProps,
        {
          data: SOURCES.vector.getUrl(id),
          uniqueIdProperty,
          filled: true,
        },
        shapeType === 'points' && [pointRadius(zoom, 0), fillColor(color.deck), border()],
        shapeType === 'polygons' && [
          {
            refinementStrategy: 'no-overlap',
            highlightColor: [255, 255, 255, 100],
          },
          fillColor(withAlpha(color.deck, 100)),
        ],
        mvtSelection({
          selectedFeatureId: selection?.target.feature.properties[uniqueIdProperty],
          uniqueIdProperty,
          selectionFillColor: shapeType === 'polygons' ? [0, 0, 0, 0] : undefined,
        }),
      );
    },
    renderDetails(selection: InteractionTarget<VectorTarget>) {
      const feature = selection.target.feature;

      return React.createElement(SimpleAssetDetails, {
        feature,
        label,
        color: color.css,
        DetailsComponent: DefaultDetails,
      });
    },
  };
}
