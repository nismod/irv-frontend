import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { exposureViewLayer } from '@/config/hazards/exposure/exposure-view-layer';
import { populationExposureHazardAtom } from '@/sidebar/sections/risk/population-exposure';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { dataParamsByGroupAtomFamily } from '@/state/data-params';

export const populationExposureLayerAtom = atom<ViewLayer | false>((get) => {
  if (!get(sidebarPathVisibilityAtomFamily('risk/population'))) return false;

  const hazard = get(populationExposureHazardAtom);
  return exposureViewLayer(hazard, get(dataParamsByGroupAtomFamily(hazard)));
});
