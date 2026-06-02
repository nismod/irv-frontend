import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { cddViewLayer } from '@/config/cdd/cdd-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { cddSelectionAtom } from '@/state/data-selection/cdd';

export const cddLayersAtom = atom<ViewLayer[] | null>((get) =>
  get(sidebarPathVisibilityAtomFamily('hazards/cdd'))
    ? [cddViewLayer(get(cddSelectionAtom))]
    : null,
);
