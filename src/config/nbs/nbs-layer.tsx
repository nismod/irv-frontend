import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { VectorHoverDescription } from '@/lib/data-map/tooltip/VectorHoverDescription';
import { StyleParams, ViewLayer } from '@/lib/data-map/view-layers';
import { fillColor } from '@/lib/deck/props/style';
import { getFeatureId } from '@/lib/deck/utils/get-feature-id';

import { ExtendedAssetDetails } from '@/details/features/asset-details';

import { assetLayerLegendConfig } from '../assets/asset-layer-legend-config';
import { makeAssetDataAccessorFactory } from '../assets/data-access';
import { makeAssetLayerFn } from '../assets/make-asset-layer-fn';
import { getNbsDataFormatsConfig } from './data-formats';
import { NbsDetails, NbsExtendedDetails } from './details';
import {
  NBS_ADAPTATION_TYPE_LABEL_LOOKUP,
  NBS_VECTOR_LAYER_PER_ADAPTATION_TYPE,
  NbsAdaptationType,
  NbsCategoricalConfig,
} from './metadata';

export function nbsViewLayer(
  styleParams: StyleParams,
  adaptationType: NbsAdaptationType,
  categoricalConfig: NbsCategoricalConfig,
): ViewLayer {
  const id = NBS_VECTOR_LAYER_PER_ADAPTATION_TYPE[adaptationType];

  const { getColor: categoricalGetColor, getMetadata: categoricalGetInteractionMeta } =
    categoricalConfig;

  const dataAccessFn = makeAssetDataAccessorFactory(id);
  const dataFormatsFn = getNbsDataFormatsConfig;
  return {
    id,
    interactionGroup: 'assets',
    styleParams,
    fn: makeAssetLayerFn({
      assetId: id,
      styleParams,
      customLayerPropsFn: ({ dataStyle: { getColor = null } = {} }) => [
        fillColor(getColor ?? categoricalGetColor),
      ],
      customDataAccessFn: dataAccessFn,
    }),
    dataFormatsFn,
    dataAccessFn,
    renderTooltip: (hover: InteractionTarget<VectorTarget>) => {
      const feature = hover.target.feature;
      const { color } = categoricalGetInteractionMeta(feature);
      return (
        <VectorHoverDescription
          hoveredObject={hover}
          label={`Nature-based solutions: ${NBS_ADAPTATION_TYPE_LABEL_LOOKUP[adaptationType]}`}
          color={color}
          idValue={'#' + getFeatureId(feature)}
        />
      );
    },
    ...assetLayerLegendConfig(styleParams, dataFormatsFn),
    renderDetails: (selection: InteractionTarget<VectorTarget>) => {
      const feature = selection.target.feature;

      const { color } = categoricalGetInteractionMeta(feature);

      return (
        <ExtendedAssetDetails
          DetailsComponent={NbsDetails}
          feature={feature}
          label={`Nature-based solutions: ${NBS_ADAPTATION_TYPE_LABEL_LOOKUP[adaptationType]}`}
          color={color}
          ApiDetailsComponent={NbsExtendedDetails}
        />
      );
    },
  };
}
