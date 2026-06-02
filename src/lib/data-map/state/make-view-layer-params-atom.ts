import type { Atom, Getter } from 'jotai';
import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import _ from 'lodash';

import { ViewLayer } from '../view-layers';

/** State factory function to create compound Jotai state for view layer params.
 *
 * View layer params are additional parameters that should be available to view layer code, but come from outside
 * of the layer itself (for example, layer selection info that is stored in the app state) so it is not known
 * at the time of view layer creation.
 *
 * @returns view layer params atom
 */
export function makeViewLayerParamsAtom<ViewLayerParamsT extends object>({
  viewLayersAtom,
  getParamsForViewLayer,
}: {
  /** Atom holding the flat list of all view layers in the application */
  viewLayersAtom: Atom<ViewLayer[]>;

  /** Function to get the params for a single view layer.
   *
   * Because it accepts Jotai's `get`, it can read from other atoms to build the view layer params object.
   **/
  getParamsForViewLayer: (viewLayer: ViewLayer) => (get: Getter) => ViewLayerParamsT;
}) {
  const singleViewLayerAtomFamily = atomFamily((viewLayerId: string) =>
    atom((get) => get(viewLayersAtom).find((x) => x.id === viewLayerId)),
  );

  const singleViewLayerParamsAtomFamily = atomFamily((viewLayerId: string) =>
    atom((get) => {
      const viewLayer = get(singleViewLayerAtomFamily(viewLayerId));

      if (viewLayer == null) return null;

      const paramsGetter = getParamsForViewLayer(viewLayer);

      return paramsGetter(get);
    }),
  );

  const viewLayersParamsAtom = atom((get) => {
    const viewLayers = get(viewLayersAtom);

    return _(viewLayers)
      .keyBy('id')
      .mapValues((viewLayer) => get(singleViewLayerParamsAtomFamily(viewLayer.id)))
      .value();
  });

  return viewLayersParamsAtom;
}

export type { Getter };
