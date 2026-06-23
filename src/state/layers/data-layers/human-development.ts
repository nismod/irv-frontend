import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { humanDevelopmentLayer } from '@/config/human-development/human-development-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { hdiRegionLevelAtom, hdiVariableAtom } from '@/state/data-selection/human-development';

export const humanDevelopmentLayerAtom = atom<ViewLayer | null>((get) =>
  get(sidebarPathVisibilityAtomFamily('vulnerability/human/human-development'))
    ? humanDevelopmentLayer(get(hdiRegionLevelAtom), get(hdiVariableAtom))
    : null,
);
