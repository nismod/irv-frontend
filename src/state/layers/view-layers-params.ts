import { atom } from 'jotai';

import { selectionAtomFamily } from '@/lib/data-map/interactions/interaction-state';
import { makeViewLayerParamsAtom } from '@/lib/data-map/state/make-view-layer-params-atom';
import type { Getter } from '@/lib/data-map/state/make-view-layer-params-atom';
import { IrvViewLayerParams, ViewLayer } from '@/lib/data-map/view-layers';

/**
 * Recoil↔Jotai migration: `viewLayersState` is still Recoil (Slice 15). MapView syncs
 * the current layer list into this replica atom so view-layer params can read it in Jotai.
 */
export const viewLayersReplicaAtom = atom<ViewLayer[]>([]);

export const viewLayersParamsAtom = makeViewLayerParamsAtom<IrvViewLayerParams>({
  viewLayersAtom: viewLayersReplicaAtom,
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
