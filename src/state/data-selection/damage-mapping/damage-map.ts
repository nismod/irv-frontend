import _ from 'lodash';
import { atom, selector } from 'recoil';

import { CurrentStateEffect } from '@/lib/recoil/state-effects/types';

import { HAZARD_DOMAINS_CONFIG } from '@/config/hazards/domains';
import { sidebarVisibilityToggleState } from '@/sidebar/SidebarContent';
import { viewState } from '@/state/view';

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
  { get, set },
  damageSource,
) => {
  _.forEach(HAZARD_DOMAINS_CONFIG, (groupConfig, group) => {
    set(sidebarVisibilityToggleState(`hazards/${group}`), group === damageSource);
  });
};
