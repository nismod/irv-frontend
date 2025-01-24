import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { rwiViewLayer } from '@/config/rwi/rwi-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';

export const rwiLayerState = selector<ViewLayer>({
  key: 'rwiLayerState',
  get: ({ get }) => get(sidebarPathVisibilityState('vulnerability/human/rwi')) && rwiViewLayer(),
});
