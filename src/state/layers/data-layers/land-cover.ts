import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { landCoverViewLayer } from '@/config/land-cover/land-cover-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const landCoverLayerAtom = jotaiAtom((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/land-cover')) ? landCoverViewLayer() : false,
);

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `landCoverLayerAtom`. */
export const landCoverLayerState = atom<ViewLayer | false>({
  key: 'landCoverLayerState',
  default: false,
});
