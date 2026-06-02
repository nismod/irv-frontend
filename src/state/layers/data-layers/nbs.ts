import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { nbsViewLayer } from '@/config/nbs/nbs-layer';
import { scopeRegionsLayer } from '@/config/nbs/scope-regions-layer';
import { backgroundAtom, showLabelsAtom } from '@/map/layers/layers-state';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import {
  nbsAdaptationTypeAtom,
  nbsCategoricalConfigAtom,
  nbsRegionScopeLevelAtom,
  nbsStyleParamsAtom,
} from '@/state/data-selection/nbs';

export const nbsScopeRegionLayerAtom = jotaiAtom((get): ViewLayer[] | null => {
  return get(sidebarPathVisibilityAtomFamily('adaptation/nbs'))
    ? [scopeRegionsLayer(get(nbsRegionScopeLevelAtom), get(showLabelsAtom), get(backgroundAtom))]
    : null;
});

export const nbsLayerAtom = jotaiAtom((get): ViewLayer | null => {
  return get(sidebarPathVisibilityAtomFamily('adaptation/nbs'))
    ? nbsViewLayer(
        get(nbsStyleParamsAtom),
        get(nbsAdaptationTypeAtom),
        get(nbsCategoricalConfigAtom),
      )
    : null;
});

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `nbsScopeRegionLayerAtom`. */
export const nbsScopeRegionLayerState = atom<ViewLayer[] | null>({
  key: 'nbsScopeRegionLayerState',
  default: null,
});

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `nbsLayerAtom`. */
export const nbsLayerState = atom<ViewLayer | null>({
  key: 'nbsLayerState',
  default: null,
});
