import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { truthyKeys } from '@/lib/helpers';

import { hazardViewLayer } from '@/config/hazards/hazard-view-layer';
import { HazardType } from '@/config/hazards/metadata';
import { dataParamsByGroupAtomFamily } from '@/state/data-params';
import { hazardVisibilityAtom } from '@/state/data-selection/hazards';

export const hazardLayersAtom = atom<ViewLayer[]>((get) =>
  (truthyKeys(get(hazardVisibilityAtom)) as HazardType[]).map((hazard) =>
    hazardViewLayer(hazard, get(dataParamsByGroupAtomFamily(hazard))),
  ),
);
