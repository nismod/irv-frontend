import { css2rgba$M } from '@/lib/colors';
import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { VectorHoverDescription } from '@/lib/data-map/tooltip/VectorHoverDescription';
import { StyleParams, ViewLayer, ViewLayerDataFormatFunction } from '@/lib/data-map/view-layers';
import { border, fillColor } from '@/lib/deck/props/style';

import { ExtendedAssetDetails } from '@/details/features/asset-details';

import { assetLayerLegendConfig } from '../assets/asset-layer-legend-config';
import { makeAssetDataAccessorFactory } from '../assets/data-access';
import { makeAssetLayerFn } from '../assets/make-asset-layer-fn';
import { NbsDetails, NbsExtendedDetails } from './details';
import { ADAPTATION_VARIABLE_LABELS, NBS_LANDUSE_METADATA } from './metadata';

export function nbsViewLayer(
  styleParams: StyleParams,
  scope?: { field: string; value: number | string },
): ViewLayer {
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
      customLayerPropsFn: ({ dataStyle: { getColor = null } = {} }) => [
        fillColor(
          getColor ??
            ((f) =>
              f.properties.option_landuse === 'crops'
                ? css2rgba$M(NBS_LANDUSE_METADATA.crops.color)
                : css2rgba$M(NBS_LANDUSE_METADATA.other.color)),
        ),
        border([150, 150, 150]),
      ],
      customDataAccessFn: dataAccessFn,
    }),
    dataFormatsFn,
    dataAccessFn,
    renderTooltip: (hover: InteractionTarget<VectorTarget>) => {
      const landuse = hover.target.feature.properties.option_landuse;
      const landuseMetadata = NBS_LANDUSE_METADATA[landuse];
      return (
        <VectorHoverDescription
          hoveredObject={hover}
          label={'Nature-based solutions'}
          color={landuseMetadata.color}
          idValue={hover.target.feature.id}
        />
      );
    },
    ...assetLayerLegendConfig(styleParams, dataFormatsFn),
    renderDetails: (selection: InteractionTarget<VectorTarget>) => {
      const feature = selection.target.feature;
      const landuse = feature.properties.option_landuse;
      const landuseMetadata = NBS_LANDUSE_METADATA[landuse];

      return (
        <ExtendedAssetDetails
          DetailsComponent={NbsDetails}
          feature={feature}
          label={`Nature-based solutions `}
          color={landuseMetadata.color}
          ApiDetailsComponent={NbsExtendedDetails}
        />
      );
    },
  };
}
