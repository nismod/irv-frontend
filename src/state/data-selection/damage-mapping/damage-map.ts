import { atom, selector } from 'recoil';

import { CurrentStateEffect } from '@/lib/recoil/state-effects/types';

import { HAZARDS_METADATA, HazardType } from '@/config/hazards/metadata';

import { hazardSelectionState } from '../hazards';

/** Is the Infrastructure Risk sidebar section shown */
export const showInfrastructureRiskState = atom({
  key: 'infrastructureRiskShownState',
  default: false,
});

/** Should infrastructure layers visualise damage values */
export const showInfrastructureDamagesState = selector({
  key: 'showInfrastructureDamagesState',
  get: ({ get }) => get(showInfrastructureRiskState),
});

export type DamageSource = HazardType;

export const damageSourceState = atom<DamageSource>({
  key: 'damageSourceState',
  default: 'fluvial',
});

export const damageTypeState = atom({
  key: 'damageTypeState',
  default: 'direct',
});

export const syncHazardsWithDamageSourceStateEffect: CurrentStateEffect<string> = (
  { set },
  damageSource,
) => {
  Object.keys(HAZARDS_METADATA).map((hazardType) => {
    set(hazardSelectionState(hazardType), hazardType === damageSource);
  });
};
