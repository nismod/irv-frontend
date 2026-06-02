import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { rwiViewLayer } from '@/config/rwi/rwi-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const rwiLayerAtom = atom<ViewLayer | false>(
  (get) => get(sidebarPathVisibilityAtomFamily('vulnerability/human/rwi')) && rwiViewLayer(),
);
