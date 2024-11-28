import { FC } from 'react';

import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { VectorHoverDescription } from '@/lib/data-map/tooltip/VectorHoverDescription';
import { StyleParams, ViewLayer, ViewLayerDataFormatFunction } from '@/lib/data-map/view-layers';
import { border, fillColor } from '@/lib/deck/props/style';

import { SimpleAssetDetails } from '@/details/features/asset-details';
import {
  DetailHeader,
  DetailsComponentProps,
  DetailSubheader,
} from '@/details/features/detail-components';

import { assetLayerLegendConfig } from '../assets/asset-layer-legend-config';
import { makeAssetDataAccessorFactory } from '../assets/data-access';
import { makeAssetLayerFn } from '../assets/make-asset-layer-fn';
import { ADAPTATION_VARIABLE_LABELS } from './metadata';

export function nbsViewLayer(styleParams: StyleParams): ViewLayer {
  const id = 'nbs';
  const dataAccessFn = makeAssetDataAccessorFactory(id);
  const dataFormatsFn: ViewLayerDataFormatFunction = ({ field }) => {
    return {
      getDataLabel: ({ field }) => ADAPTATION_VARIABLE_LABELS.find((x) => x.value === field)?.label,
      getValueFormatted: (value) =>
        typeof value === 'number'
          ? value.toLocaleString(undefined, {
              maximumSignificantDigits: 3,
            })
          : `${value}`,
    };
  };
  return {
    id,
    interactionGroup: 'assets',
    styleParams,
    fn: makeAssetLayerFn({
      assetId: id,
      styleParams,
      customLayerPropsFn: ({ dataStyle: { getColor } }) => [
        fillColor(getColor ?? [255, 255, 255, 255]),
        border(),
      ],
      customDataAccessFn: dataAccessFn,
    }),
    dataFormatsFn,
    dataAccessFn,
    renderTooltip: (hover: InteractionTarget<VectorTarget>) => {
      return (
        <VectorHoverDescription
          hoveredObject={hover}
          label={'Nature-based solutions'}
          color={'#ffffff'}
          idValue={hover.target.feature.id}
        />
      );
    },
    ...assetLayerLegendConfig(styleParams, dataFormatsFn),
    renderDetails: (selection: InteractionTarget<VectorTarget>) => {
      const feature = selection.target.feature;

      return (
        <SimpleAssetDetails
          detailsComponent={NbsDetails}
          feature={feature}
          label={`Nature-based solutions `}
        />
      );
    },
  };
}

export const NbsDetails: FC<DetailsComponentProps> = ({ f }) => {
  return (
    <>
      <DetailHeader>{f.feature_id}</DetailHeader>
      <DetailSubheader>Land use: {f.option_landuse}</DetailSubheader>
    </>
  );
};
