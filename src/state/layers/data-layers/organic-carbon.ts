import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { natureRasterViewLayer } from '@/config/natural-assets/nature-raster-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const organicCarbonLayerAtom = atom<ViewLayer | null>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/organic-carbon'))
    ? natureRasterViewLayer('organic_carbon')
    : null,
);
