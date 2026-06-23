import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { healthsitesViewLayer } from '@/config/healthcare/healthsites-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const healthcareLayersAtom = atom<ViewLayer | false>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/healthsites')) ? healthsitesViewLayer() : false,
);
