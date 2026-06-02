import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { jrcPopulationViewLayer } from '@/config/population/population-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const populationLayerAtom = jotaiAtom((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/population')) ? jrcPopulationViewLayer() : false,
);

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `populationLayerAtom`. */
export const populationLayerState = atom<ViewLayer | false>({
  key: 'populationLayerState',
  default: false,
});
