import { atomFamily, selector } from 'recoil';

import { HAZARDS_MAP_ORDER } from '@/config/hazards/metadata';

export const hazardSelectionState = atomFamily({
  key: 'hazardSelectionState',
  default: false,
});

export const hazardVisibilityState = selector({
  key: 'hazardVisibilityState',
  get: ({ get }) => {
    return Object.fromEntries(
      HAZARDS_MAP_ORDER.map((group) => [group, get(hazardSelectionState(group))]),
    );
  },
});
