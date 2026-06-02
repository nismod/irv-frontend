import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { healthsitesViewLayer } from '@/config/healthcare/healthsites-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const healthcareLayersAtom = jotaiAtom((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/healthsites')) ? healthsitesViewLayer() : false,
);

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `healthcareLayersAtom`. */
export const healthcareLayersState = atom<ViewLayer | false>({
  key: 'healthcareLayersState',
  default: false,
});
