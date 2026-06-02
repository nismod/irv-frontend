import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { jrcPopulationViewLayer } from '@/config/population/population-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const populationLayerAtom = atom<ViewLayer | false>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/population')) ? jrcPopulationViewLayer() : false,
);
