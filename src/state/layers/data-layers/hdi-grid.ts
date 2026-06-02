import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { hdiGridViewLayer } from '@/config/hdi-grid/hdi-grid-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const hdiGridLayerAtom = jotaiAtom((get) =>
  get(sidebarPathVisibilityAtomFamily('vulnerability/human/hdi-grid')) ? hdiGridViewLayer() : false,
);

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `hdiGridLayerAtom`. */
export const hdiGridLayerState = atom<ViewLayer | false>({
  key: 'hdiGridLayerState',
  default: false,
});
