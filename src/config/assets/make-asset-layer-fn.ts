import { MVTLayerProps } from 'deck.gl';

import { colorMap } from '@/lib/color-map';
import { StyleParams, ViewLayerDataAccessFunction } from '@/lib/data-map/view-layers';
import { basicMvtLayer } from '@/lib/deck/layers/basic-mvt-layer';
import { makeDataColorAccessor } from '@/lib/deck/props/data-color';
import { mvtSelection } from '@/lib/deck/props/mvt-selection';
import { GetColor } from '@/lib/deck/props/style';
import { tiledDataLoading } from '@/lib/deck/props/tiled-data-loading';

import { SOURCES } from '../sources';

export interface DataStyle {
  getColor?: GetColor;
}

export type AssetCustomPropsFunction = (options: {
  zoom: number;
  dataStyle?: DataStyle;
}) => Partial<MVTLayerProps>[];

/**
 * Make a map render function for a vector asset layer
 *
 */
export function makeAssetLayerFn({
  assetId,
  styleParams,
  customDataAccessFn,
  customLayerPropsFn,
  selectionPolygonOffset = -1000,
}: {
  assetId: string;
  styleParams?: StyleParams;
  customDataAccessFn?: ViewLayerDataAccessFunction;
  customLayerPropsFn?: AssetCustomPropsFunction;
  selectionPolygonOffset?: number;
}) {
  const dataAccessor = customDataAccessFn?.(styleParams?.colorMap?.fieldSpec);
  const dataLoader = dataAccessor?.dataLoader;

  // need to specify `id` as unique ID property because loading MVT with binary:false moves the id into properties (seems like a deck.gl bug)
  const uniqueIdProperty = 'id';

  const dataStyle: DataStyle = styleParams?.colorMap
    ? {
        getColor: makeDataColorAccessor(dataAccessor, colorMap(styleParams.colorMap.colorSpec)),
      }
    : undefined;

  return ({ deckProps, zoom, selection }) =>
    basicMvtLayer(
      deckProps,
      {
        data: SOURCES.vector.getUrl(assetId),
        uniqueIdProperty,
      },
      mvtSelection({
        selectedFeatureId: selection?.target.feature.properties[uniqueIdProperty],
        polygonOffset: selectionPolygonOffset,
        uniqueIdProperty,
      }),
      dataLoader && tiledDataLoading({ dataLoader }),
      ...(customLayerPropsFn?.({ zoom, dataStyle }) ?? []),
    );
}
