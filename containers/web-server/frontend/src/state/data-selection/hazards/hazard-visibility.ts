import { selector } from 'recoil';

import { HAZARDS_MAP_ORDER } from '@/config/hazards/metadata';
import { damageSourceState, showInfrastructureDamagesState } from '@/state/data-selection/damage-mapping/damage-map';

import { getHazardSelectionAggregate } from './hazard-selection';

export const hazardVisibilityState = selector({
  key: 'hazardVisibilityState',
  get: ({ get }) => {
    if (get(showInfrastructureDamagesState)) {
      const selectedDamageSource = get(damageSourceState);
      if (selectedDamageSource === 'all') {
        return {};
      } else {
        return {
          [selectedDamageSource]: true,
        };
      }
    } else {
      return getHazardSelectionAggregate({ get }, HAZARDS_MAP_ORDER);
    }
  },
});
