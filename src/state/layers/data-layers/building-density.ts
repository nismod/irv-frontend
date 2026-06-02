import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { buildingDensityLayer } from '@/config/building-density/building-density-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { buildingDensityTypeAtom } from '@/state/data-selection/building-density';

export const buildingDensityLayerAtom = atom<ViewLayer | null>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/buildings'))
    ? buildingDensityLayer(get(buildingDensityTypeAtom))
    : null,
);
