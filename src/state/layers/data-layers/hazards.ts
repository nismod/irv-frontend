import { atom as jotaiAtom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { truthyKeys } from '@/lib/helpers';

import { hazardViewLayer } from '@/config/hazards/hazard-view-layer';
import { HazardType } from '@/config/hazards/metadata';
import { hazardVisibilityAtom } from '@/state/data-selection/hazards';

/**
 * Recoil↔Jotai migration: param values still live in Recoil `dataParamsByGroupState` (Slice 14).
 * Each hazard control syncs its group params here so `hazardLayersAtom` can read them.
 */
export const hazardGroupParamsReplicaAtomFamily = atomFamily((_hazard: HazardType) =>
  jotaiAtom<Record<string, unknown>>({}),
);

export const hazardLayersAtom = jotaiAtom((get): ViewLayer[] =>
  (truthyKeys(get(hazardVisibilityAtom)) as HazardType[]).map((hazard) =>
    hazardViewLayer(hazard, get(hazardGroupParamsReplicaAtomFamily(hazard))),
  ),
);

/**
 * Recoil↔Jotai migration: hazard view layers are computed in Jotai (`hazardLayersAtom`).
 * `ViewLayersBridgeSync` writes into this replica atom so `viewLayersState` keeps its ordering.
 */
export const hazardLayerState = atom<ViewLayer[]>({
  key: 'hazardLayerState',
  default: [],
});
