import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { hdiGridViewLayer } from '@/config/hdi-grid/hdi-grid-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const hdiGridLayerAtom = atom<ViewLayer | false>((get) =>
  get(sidebarPathVisibilityAtomFamily('vulnerability/human/hdi-grid')) ? hdiGridViewLayer() : false,
);
