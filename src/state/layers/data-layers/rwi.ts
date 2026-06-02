import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { rwiViewLayer } from '@/config/rwi/rwi-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const rwiLayerAtom = jotaiAtom((get) =>
  get(sidebarPathVisibilityAtomFamily('vulnerability/human/rwi')) ? rwiViewLayer() : false,
);

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `rwiLayerAtom`. */
export const rwiLayerState = atom<ViewLayer | false>({
  key: 'rwiLayerState',
  default: false,
});
