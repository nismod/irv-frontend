import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { topographyViewLayer } from '@/config/topography/topography-view-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import { topographySelectionState } from '@/state/data-selection/topography';

export const topographyLayersState = selector<ViewLayer[]>({
  key: 'topographyLayerState',
  get: ({ get }) =>
    get(sidebarPathVisibilityState('exposure/topography'))
      ? [topographyViewLayer(get(topographySelectionState))]
      : [],
});
