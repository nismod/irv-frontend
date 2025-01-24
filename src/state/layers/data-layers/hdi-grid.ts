import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { hdiGridViewLayer } from '@/config/hdi-grid/hdi-grid-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';

export const hdiGridLayerState = selector<ViewLayer>({
  key: 'hdiGridLayerState',
  get: ({ get }) =>
    get(sidebarPathVisibilityState('vulnerability/human/hdi-grid')) && hdiGridViewLayer(),
});
