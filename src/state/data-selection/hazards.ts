import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import { getParentPath } from '@/lib/paths/utils';

import {
  getHazardSidebarPath,
  HAZARDS_MAP_ORDER,
  HAZARDS_METADATA,
  HazardType,
} from '@/config/hazards/metadata';

export const hazardSelectionAtomFamily = atomFamily((_type: HazardType) => atom(false));

export const hazardVisibilityAtom = atom((get) =>
  Object.fromEntries(
    HAZARDS_MAP_ORDER.map((group) => [group, get(hazardSelectionAtomFamily(group))]),
  ),
);

export type SidebarVisibilitySetter = (path: string, visible: boolean) => void;

/**
 * When a single hazard should be active (e.g. Population / Infrastructure Risk),
 * enable its sidebar path and ancestors and turn sibling hazard paths off.
 *
 * Writes Recoil `sidebarVisibilityToggleState` until Slice 15 migrates the sidebar hub.
 */
export function showOneHazardStateEffect(
  setSidebarVisibility: SidebarVisibilitySetter,
  newHazard: string,
) {
  Object.keys(HAZARDS_METADATA).forEach((hazardType: HazardType) => {
    const path = getHazardSidebarPath(hazardType);
    const visible = hazardType === newHazard;
    if (visible) {
      // if setting to visible, recursively ensure the ancestors are also visible
      setRecursive(setSidebarVisibility, path, true);
    } else {
      // if setting to invisible, it is enough to turn off visibility for the current path
      setSidebarVisibility(path, visible);
    }
  });
}

function setRecursive(setSidebarVisibility: SidebarVisibilitySetter, path: string, value: boolean) {
  const parentPath = getParentPath(path);
  if (parentPath !== '') {
    setRecursive(setSidebarVisibility, parentPath, value);
  }
  setSidebarVisibility(path, value);
}
