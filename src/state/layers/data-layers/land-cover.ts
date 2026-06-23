import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { landCoverViewLayer } from '@/config/land-cover/land-cover-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const landCoverLayerAtom = atom<ViewLayer | false>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/land-cover')) ? landCoverViewLayer() : false,
);
