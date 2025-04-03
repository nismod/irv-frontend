import _ from 'lodash';
import { RecoilValue, selectorFamily } from 'recoil';

import { sidebarPathVisibilityState, sidebarVisibilityToggleState } from '@/sidebar/SidebarContent';

export const hazardSelectionState = selectorFamily({
  key: 'hazardSelectionState',
  get:
    (hazard: string) =>
    ({ get }) =>
      get(sidebarPathVisibilityState(`hazards/${hazard}`)),
});

interface TransactionGetterInterface {
  get<T>(a: RecoilValue<T>): T;
}

export function getHazardSelectionAggregate(
  { get }: TransactionGetterInterface,
  hazards: readonly string[],
) {
  return _.fromPairs(hazards.map((group) => [group, get(hazardSelectionState(group))]));
}
