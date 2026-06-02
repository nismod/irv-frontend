import { selectionAtomFamily } from '@/lib/data-map/interactions/interaction-state';
import { makeViewLayerParamsAtom } from '@/lib/data-map/state/make-view-layer-params-atom';
import type { Getter } from '@/lib/data-map/state/make-view-layer-params-atom';
import { IrvViewLayerParams, ViewLayer } from '@/lib/data-map/view-layers';

import { viewLayersAtom } from './view-layers';

export const viewLayersParamsAtom = makeViewLayerParamsAtom<IrvViewLayerParams>({
  viewLayersAtom,
  getParamsForViewLayer: (viewLayer: ViewLayer) => (get: Getter) => ({
    selection: getSelectionParam(get, viewLayer),
  }),
});

function getSelectionParam(get: Getter, viewLayer: ViewLayer) {
  const interactionGroup = viewLayer.interactionGroup;
  if (interactionGroup == null) return null;

  const groupSelection = get(selectionAtomFamily(interactionGroup));

  return groupSelection?.viewLayer.id === viewLayer.id ? groupSelection : null;
}
