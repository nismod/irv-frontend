import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { travelTimeViewLayer } from '@/config/travel-time/travel-time-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { travelTimeTypeAtom } from '@/state/data-selection/travel-time';

export const travelTimeLayerAtom = atom<ViewLayer | null>((get) =>
  get(sidebarPathVisibilityAtomFamily('vulnerability/human/travel-time'))
    ? travelTimeViewLayer(get(travelTimeTypeAtom))
    : null,
);
