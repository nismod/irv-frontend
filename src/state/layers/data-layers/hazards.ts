import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { truthyKeys } from '@/lib/helpers';

import { hazardViewLayer } from '@/config/hazards/hazard-view-layer';
import { HazardType } from '@/config/hazards/metadata';
import { dataParamsByGroupAtomFamily } from '@/state/data-params';
import { hazardVisibilityAtom } from '@/state/data-selection/hazards';

export const hazardLayersAtom = jotaiAtom((get): ViewLayer[] =>
  (truthyKeys(get(hazardVisibilityAtom)) as HazardType[]).map((hazard) =>
    hazardViewLayer(hazard, get(dataParamsByGroupAtomFamily(hazard))),
  ),
);

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `hazardLayersAtom`. */
export const hazardLayerState = atom<ViewLayer[]>({
  key: 'hazardLayerState',
  default: [],
});
