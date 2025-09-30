import { atom, selector } from 'recoil';

import { HazardType } from '@/config/hazards/metadata';

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
