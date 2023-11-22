import { selector } from 'recoil';

import { exposureViewLayer } from '@/config/hazards/exposure/exposure-view-layer';
import { populationExposureHazardState } from '@/sidebar/sections/risk/population-exposure';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
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
