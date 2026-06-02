import { atom } from 'jotai';

import { HdiRegionLevel, HdiVariableType } from '@/config/human-development/metadata';

export const hdiVariableAtom = atom<HdiVariableType>('subnational_hdi');

export const hdiRegionLevelAtom = atom<HdiRegionLevel>('countries');
