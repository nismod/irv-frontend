import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { nbsViewLayer } from '@/config/nbs/nbs-layer';
import { scopeRegionsLayer } from '@/config/nbs/scope-regions-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import { nbsRegionScopeLevelState, nbsStyleParamsState } from '@/state/data-selection/nbs';

export const nbsScopeRegionLayerState = selector<ViewLayer>({
  key: 'nbsScopeRegionLayerState',
  get: ({ get }) => {
    const scopeRegionLevel = get(nbsRegionScopeLevelState);
    return get(sidebarPathVisibilityState('adaptation/nbs'))
      ? scopeRegionsLayer(scopeRegionLevel)
      : null;
  },
});

export const nbsLayerState = selector<ViewLayer>({
  key: 'nbsLayerState',
  get: ({ get }) => {
    return get(sidebarPathVisibilityState('adaptation/nbs'))
      ? nbsViewLayer(get(nbsStyleParamsState))
      : null;
  },
});
