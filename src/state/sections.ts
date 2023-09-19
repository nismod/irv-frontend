import { atomFamily } from 'recoil';

import { truthyKeys } from '@/lib/helpers';
import { StateEffect } from '@/lib/recoil/state-effects/types';

import { HAZARDS_UI_ORDER } from '@/config/hazards/metadata';

import { damageSourceState } from './data-selection/damage-mapping/damage-map';
import { getHazardSelectionAggregate } from './data-selection/hazards/hazard-selection';

export const sectionStyleValueState = atomFamily<string, string>({
  key: 'sectionStyleValueState',
  default: '',
});

export const networksStyleStateEffect: StateEffect<string> = ({ get, set }, style) => {
  if (style === 'damages') {
    const hazardSelection = getHazardSelectionAggregate({ get }, HAZARDS_UI_ORDER);
    const visibleHazards = truthyKeys(hazardSelection);
    const defaultDamageSource = visibleHazards[0] ?? 'all';

    set(damageSourceState, defaultDamageSource);
  }
};
