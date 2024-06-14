import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { cddViewLayer } from '@/config/cdd/cdd-view-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import { cddSelectionState } from '@/state/data-selection/cdd';

export const cddLayersState = selector<ViewLayer[]>({
  key: 'cddLayerState',
  get: ({ get }) =>
    get(sidebarPathVisibilityState('hazards/cdd')) ? [cddViewLayer(get(cddSelectionState))] : [],
});
