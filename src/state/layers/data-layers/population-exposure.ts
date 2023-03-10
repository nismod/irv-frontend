import { selector } from 'recoil';

import { exposureViewLayer } from '@/config/hazards/exposure/exposure-view-layer';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import { populationExposureHazardState } from '@/sidebar/sections/risk/population-exposure';
import { dataParamsByGroupState } from '@/state/data-params';

export const populationExposureLayerState = selector({
  key: 'populationExposureLayerState',
  get: ({ get }) => {
    const hazard = get(populationExposureHazardState);
    return (
      get(sidebarPathVisibilityState('risk/population')) &&
      exposureViewLayer(hazard, get(dataParamsByGroupState(hazard)))
    );
  },
});
