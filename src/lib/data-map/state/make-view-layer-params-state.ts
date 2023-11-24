import _ from 'lodash';
import { RecoilValueReadOnly, selector, selectorFamily } from 'recoil';

import { ViewLayer, ViewLayerParams } from '@/lib/data-map/view-layers';
import { ReadSelectorGetDefinition } from '@/lib/recoil/types';

export function makeViewLayerParamsState({
  key,
  viewLayersState,
  getParamsForViewLayer,
}: {
  key: string;
  viewLayersState: RecoilValueReadOnly<ViewLayer[]>;
  getParamsForViewLayer: (viewLayer: ViewLayer) => ReadSelectorGetDefinition<ViewLayerParams>;
}) {
  const singleViewLayerState = selectorFamily<ViewLayer, string>({
    key: `${key}/singleViewLayerState`,
    get:
      (viewLayerId: string) =>
      ({ get }) =>
        get(viewLayersState).find((x) => x.id === viewLayerId),
  });

  const singleViewLayerParamsState = selectorFamily<ViewLayerParams, string>({
    key: `${key}/singleViewLayerParamsState`,
    get: (viewLayerId: string) => (ops) => {
      const viewLayer = ops.get(singleViewLayerState(viewLayerId));

      if (viewLayer == null) return {};

      const paramsGetter = getParamsForViewLayer(viewLayer);

      return paramsGetter(ops);
    },
  });

  const viewLayersParamsState = selector<Record<string, ViewLayerParams>>({
    key: `${key}/viewLayersParamsState`,
    get: ({ get }) => {
      const viewLayers = get(viewLayersState);

      return _(viewLayers)
        .keyBy('id')
        .mapValues((viewLayer) => get(singleViewLayerParamsState(viewLayer.id)))
        .value();
    },
  });

  return viewLayersParamsState;
}
