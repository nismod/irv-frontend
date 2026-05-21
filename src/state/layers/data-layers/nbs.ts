import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { nbsViewLayer } from '@/config/nbs/nbs-layer';
import { scopeRegionsLayer } from '@/config/nbs/scope-regions-layer';
import { backgroundAtom, showLabelsAtom } from '@/map/layers/layers-state';
import {
  nbsAdaptationTypeAtom,
  nbsCategoricalConfigAtom,
  nbsRegionScopeLevelAtom,
  nbsStyleParamsAtom,
} from '@/state/data-selection/nbs';

/**
 * Recoil↔Jotai migration: sidebar path visibility is still Recoil (Slice 15).
 * `SidebarPathVisibilityBridgeSync` syncs `sidebarPathVisibilityState('adaptation/nbs')` here.
 */
export const adaptationNbsVisibleReplicaAtom = jotaiAtom<boolean>(false);

export const nbsScopeRegionLayerAtom = jotaiAtom((get): ViewLayer[] | null => {
  return get(adaptationNbsVisibleReplicaAtom)
    ? [scopeRegionsLayer(get(nbsRegionScopeLevelAtom), get(showLabelsAtom), get(backgroundAtom))]
    : null;
});

export const nbsLayerAtom = jotaiAtom((get): ViewLayer | null => {
  return get(adaptationNbsVisibleReplicaAtom)
    ? nbsViewLayer(
        get(nbsStyleParamsAtom),
        get(nbsAdaptationTypeAtom),
        get(nbsCategoricalConfigAtom),
      )
    : null;
});

/**
 * Recoil↔Jotai migration: NbS view layers are computed in Jotai (`nbsLayerAtom`, `nbsScopeRegionLayerAtom`).
 * `ViewLayersBridgeSync` writes into these replica atoms so `viewLayersState` keeps its ordering.
 */
export const nbsScopeRegionLayerState = atom<ViewLayer[] | null>({
  key: 'nbsScopeRegionLayerState',
  default: null,
});

export const nbsLayerState = atom<ViewLayer | null>({
  key: 'nbsLayerState',
  default: null,
});
