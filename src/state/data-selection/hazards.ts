import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import { HAZARDS_MAP_ORDER, HazardType } from '@/config/hazards/metadata';

export const hazardSelectionAtomFamily = atomFamily((_type: HazardType) => atom(false));

export const hazardVisibilityAtom = atom((get) =>
  Object.fromEntries(
    HAZARDS_MAP_ORDER.map((group) => [group, get(hazardSelectionAtomFamily(group))]),
  ),
);
