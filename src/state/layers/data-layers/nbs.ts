import { selector } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { nbsViewLayer } from '@/config/nbs/nbs-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import { nbsStyleParamsState } from '@/state/data-selection/nbs';

export const nbsLayerState = selector<ViewLayer>({
  key: 'nbsLayerState',
  get: ({ get }) =>
    get(sidebarPathVisibilityState('adaptation/nbs'))
      ? nbsViewLayer(get(nbsStyleParamsState))
      : null,
});
