import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { regionalExposureLayer } from '@/config/regional-risk/regional-risk-layer';
import { regionalExposureVariableAtom } from '@/sidebar/sections/risk/regional-risk';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const regionalExposureLayerAtom = atom<ViewLayer | false>((get) => {
  if (!get(sidebarPathVisibilityAtomFamily('risk/regional'))) return false;

  return regionalExposureLayer(get(regionalExposureVariableAtom));
});
