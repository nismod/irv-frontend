import { MVTLayerProps } from 'deck.gl';

import { colorMap } from '@/lib/color-map';
import { StyleParams, ViewLayerDataAccessFunction } from '@/lib/data-map/view-layers';
import { basicMvtLayer } from '@/lib/deck/layers/basic-mvt-layer';
import { makeDataColorAccessor } from '@/lib/deck/props/data-color';
import { mvtHover } from '@/lib/deck/props/mvt-hover';
import { mvtSelection } from '@/lib/deck/props/mvt-selection';
import { GetColor } from '@/lib/deck/props/style';
import { tiledDataLoading } from '@/lib/deck/props/tiled-data-loading';
import { getFeatureId } from '@/lib/deck/utils/get-feature-id';

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

  const dataStyle: DataStyle = styleParams?.colorMap
    ? {
        getColor: makeDataColorAccessor(dataAccessor, colorMap(styleParams.colorMap.colorSpec)),
      }
    : undefined;

  return ({ deckProps, zoom, selection, hoveredFeatureId = undefined }) => {
    // Current tiles keep native IDs on feature.id. Share this identity between
    // selection and hover, and avoid redrawing a selected feature on hover.
    const selectedFeatureId = getFeatureId(selection?.target.feature);
    return basicMvtLayer(
      deckProps,
      {
        data: SOURCES.vector.getUrl(assetId),
      },
      mvtSelection({
        selectedFeatureId,
        polygonOffset: selectionPolygonOffset,
      }),
      dataLoader && tiledDataLoading({ dataLoader }),
      ...(customLayerPropsFn?.({ zoom, dataStyle }) ?? []),
      mvtHover(hoveredFeatureId === selectedFeatureId ? undefined : hoveredFeatureId),
    );
  };
}
