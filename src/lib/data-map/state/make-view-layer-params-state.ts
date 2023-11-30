import _ from 'lodash';
import { RecoilValueReadOnly, selector, selectorFamily } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { ReadSelectorGetDefinition } from '@/lib/recoil/types';

/** State factory function to create compound Recoil state for view layer params.
 *
 * View layer params are additional parameters that should be available to view layer code, but come from outside
 * of the layer itself (for example, layer selection info that is stored in the app state) so it is not known
 * at the time of view layer creation.
 *
 * @returns view layer params Recoil selector
 */
export function makeViewLayerParamsState<ViewLayerParamsT extends object>({
  key,
  viewLayersState,
  getParamsForViewLayer,
}: {
  /** Recoil key prefix for all components of the compound state */
  key: string;

  /** Recoil state for the flat list of all view layers in the application */
  viewLayersState: RecoilValueReadOnly<ViewLayer[]>;

  /** Function to get the params for a single view layer.
   *
   * This should be defined similarly to a Recoil selector's `get`.
   *
   * Because it accepts the `({get})` Recoil ops object, it can read from other pieces of Recoil state to
   * build the view layer params object
   **/
  getParamsForViewLayer: (viewLayer: ViewLayer) => ReadSelectorGetDefinition<ViewLayerParamsT>;
}) {
  const singleViewLayerState = selectorFamily<ViewLayer, string>({
    key: `${key}/singleViewLayerState`,
    get:
      (viewLayerId: string) =>
      ({ get }) =>
        get(viewLayersState).find((x) => x.id === viewLayerId),
  });

  const singleViewLayerParamsState = selectorFamily<ViewLayerParamsT, string>({
    key: `${key}/singleViewLayerParamsState`,
    get: (viewLayerId: string) => (ops) => {
      const viewLayer = ops.get(singleViewLayerState(viewLayerId));

      if (viewLayer == null) return null;

      const paramsGetter = getParamsForViewLayer(viewLayer);

      return paramsGetter(ops);
    },
  });

  const viewLayersParamsState = selector<Record<string, ViewLayerParamsT>>({
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
