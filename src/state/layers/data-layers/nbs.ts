import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { nbsViewLayer } from '@/config/nbs/nbs-layer';
import { scopeRegionsLayer } from '@/config/nbs/scope-regions-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import {
  nbsRegionScopeLevelIdPropertyState,
  nbsRegionScopeLevelState,
  nbsSelectedScopeRegionState,
  nbsStyleParamsState,
} from '@/state/data-selection/nbs';

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
    const scopeLevelIdProperty = get(nbsRegionScopeLevelIdPropertyState);
    const selectedRegionId = get(nbsSelectedScopeRegionState);
    return get(sidebarPathVisibilityState('adaptation/nbs')) && selectedRegionId
      ? nbsViewLayer(get(nbsStyleParamsState), {
          field: scopeLevelIdProperty,
          value: selectedRegionId,
        })
      : null;
  },
});
