import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { natureRasterViewLayer } from '@/config/natural-assets/nature-raster-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const organicCarbonLayerAtom = jotaiAtom((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/organic-carbon'))
    ? natureRasterViewLayer('organic_carbon')
    : null,
);

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `organicCarbonLayerAtom`. */
export const organicCarbonLayerState = atom<ViewLayer | null>({
  key: 'organicCarbonLayerState',
  default: null,
});
