import { atom } from 'jotai';

import { BuildingDensityType } from '@/config/building-density/metadata';

export const buildingDensityTypeAtom = atom<BuildingDensityType>('all');
