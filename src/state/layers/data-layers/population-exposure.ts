import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { exposureViewLayer } from '@/config/hazards/exposure/exposure-view-layer';
import { populationExposureHazardAtom } from '@/sidebar/sections/risk/population-exposure';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { dataParamsByGroupAtomFamily } from '@/state/data-params';

export const populationExposureLayerAtom = jotaiAtom((get): ViewLayer | false => {
  if (!get(sidebarPathVisibilityAtomFamily('risk/population'))) return false;

  const hazard = get(populationExposureHazardAtom);
  return exposureViewLayer(hazard, get(dataParamsByGroupAtomFamily(hazard)));
});

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `populationExposureLayerAtom`. */
export const populationExposureLayerState = atom<ViewLayer | false>({
  key: 'populationExposureLayerState',
  default: false,
});
