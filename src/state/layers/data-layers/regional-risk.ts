import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { regionalExposureLayer } from '@/config/regional-risk/regional-risk-layer';
import { regionalExposureVariableAtom } from '@/sidebar/sections/risk/regional-risk';

/**
 * Recoil↔Jotai migration: sidebar path visibility is still Recoil (Slice 15).
 * `SidebarPathVisibilityBridgeSync` syncs `sidebarPathVisibilityState('risk/regional')` here.
 */
export const riskRegionalVisibleReplicaAtom = jotaiAtom<boolean>(false);

export const regionalExposureLayerAtom = jotaiAtom((get): ViewLayer | false => {
  if (!get(riskRegionalVisibleReplicaAtom)) return false;

  return regionalExposureLayer(get(regionalExposureVariableAtom));
});

/**
 * Recoil↔Jotai migration: regional exposure layer is computed in Jotai (`regionalExposureLayerAtom`).
 * `ViewLayersBridgeSync` writes into this replica atom so `viewLayersState` keeps its ordering.
 */
export const regionalExposureLayerState = atom<ViewLayer | false>({
  key: 'regionalExposureLayerState',
  default: false,
});
