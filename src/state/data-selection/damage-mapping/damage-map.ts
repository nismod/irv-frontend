import { atom, selector } from 'recoil';

import { CurrentStateEffect } from '@/lib/recoil/state-effects/types';

import { HAZARDS_METADATA } from '@/config/hazards/metadata';
import { sidebarVisibilityToggleState } from '@/sidebar/SidebarContent';
import { viewState } from '@/state/view';

import { hazardSelectionState } from '../hazards';

export const showInfrastructureDamagesState = selector({
  key: 'showInfrastructureDamagesState',
  get: ({ get }) =>
    get(viewState) === 'risk' && get(sidebarVisibilityToggleState('risk/infrastructure')),
});

export const damageSourceState = atom({
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
