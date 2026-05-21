import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { exposureViewLayer } from '@/config/hazards/exposure/exposure-view-layer';
import {
  populationExposureGroupParamsReplicaAtom,
  populationExposureHazardAtom,
} from '@/sidebar/sections/risk/population-exposure';

/**
 * Recoil↔Jotai migration: sidebar path visibility is still Recoil (Slice 15).
 * `SidebarPathVisibilityBridgeSync` syncs `sidebarPathVisibilityState('risk/population')` here.
 */
export const riskPopulationVisibleReplicaAtom = jotaiAtom<boolean>(false);

export const populationExposureLayerAtom = jotaiAtom((get): ViewLayer | false => {
  if (!get(riskPopulationVisibleReplicaAtom)) return false;

  const hazard = get(populationExposureHazardAtom);
  return exposureViewLayer(hazard, get(populationExposureGroupParamsReplicaAtom));
});

/**
 * Recoil↔Jotai migration: population exposure layer is computed in Jotai (`populationExposureLayerAtom`).
 * `ViewLayersBridgeSync` writes into this replica atom so `viewLayersState` keeps its ordering.
 */
export const populationExposureLayerState = atom<ViewLayer | false>({
  key: 'populationExposureLayerState',
  default: false,
});
