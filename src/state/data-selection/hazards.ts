import { atomFamily, selector } from 'recoil';

import { getParentPath } from '@/lib/paths/utils';
import { CurrentStateEffect, StateEffectAtomicInterface } from '@/lib/recoil/state-effects/types';
import { RecoilStateFamily } from '@/lib/recoil/types';

import {
  getHazardSidebarPath,
  HAZARDS_MAP_ORDER,
  HAZARDS_METADATA,
  HazardType,
} from '@/config/hazards/metadata';
import { sidebarVisibilityToggleState } from '@/sidebar/SidebarContent';

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

export const showOneHazardStateEffect: CurrentStateEffect<string> = (iface, newHazard) => {
  Object.keys(HAZARDS_METADATA).map((hazardType: HazardType) => {
    const path = getHazardSidebarPath(hazardType);
    const visible = hazardType === newHazard;
    if (visible) {
      // if setting to visible, recursively ensure the ancestors are also visible
      setRecursive(iface, sidebarVisibilityToggleState, path, true);
    } else {
      // if setting to invisible, it is enough to turn off visibility for the current path
      iface.set(sidebarVisibilityToggleState(path), visible);
    }
  });
};

function setRecursive(
  iface: StateEffectAtomicInterface,
  stateFamily: RecoilStateFamily<boolean, string>,
  path: string,
  value: boolean,
) {
  const parentPath = getParentPath(path);
  if (parentPath !== '') {
    setRecursive(iface, stateFamily, parentPath, value);
  }
  iface.set(stateFamily(path), value);
}
