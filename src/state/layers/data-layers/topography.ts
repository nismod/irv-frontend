import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { topographyViewLayer } from '@/config/topography/topography-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { topographySelectionAtom } from '@/state/data-selection/topography';

export const topographyLayersAtom = atom<ViewLayer[]>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/topography'))
    ? [topographyViewLayer(get(topographySelectionAtom))]
    : [],
);
