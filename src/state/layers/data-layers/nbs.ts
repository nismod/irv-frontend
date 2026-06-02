import { atom } from 'jotai';

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

export const nbsScopeRegionLayerAtom = atom<ViewLayer[] | null>((get) =>
  get(sidebarPathVisibilityAtomFamily('adaptation/nbs'))
    ? [scopeRegionsLayer(get(nbsRegionScopeLevelAtom), get(showLabelsAtom), get(backgroundAtom))]
    : null,
);

export const nbsLayerAtom = atom<ViewLayer | null>((get) =>
  get(sidebarPathVisibilityAtomFamily('adaptation/nbs'))
    ? nbsViewLayer(
        get(nbsStyleParamsAtom),
        get(nbsAdaptationTypeAtom),
        get(nbsCategoricalConfigAtom),
      )
    : null,
);
