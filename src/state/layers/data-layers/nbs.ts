import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { nbsViewLayer } from '@/config/nbs/nbs-layer';
import { scopeRegionsLayer } from '@/config/nbs/scope-regions-layer';
import { backgroundState, showLabelsState } from '@/map/layers/layers-state';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import {
  nbsAdaptationTypeState,
  nbsCategoricalConfigState,
  nbsRegionScopeLevelState,
  nbsStyleParamsState,
} from '@/state/data-selection/nbs';

export const nbsScopeRegionLayerState = selector<ViewLayer[]>({
  key: 'nbsScopeRegionLayerState',
  get: ({ get }) => {
    return get(sidebarPathVisibilityState('adaptation/nbs'))
      ? [
          scopeRegionsLayer(
            get(nbsRegionScopeLevelState),
            get(showLabelsState),
            get(backgroundState),
          ),
        ]
      : null;
  },
});

export const nbsLayerState = selector<ViewLayer>({
  key: 'nbsLayerState',
  get: ({ get }) => {
    return get(sidebarPathVisibilityState('adaptation/nbs'))
      ? nbsViewLayer(
          get(nbsStyleParamsState),
          get(nbsAdaptationTypeState),
          get(nbsCategoricalConfigState),
        )
      : null;
  },
});
