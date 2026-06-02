import { atom } from 'jotai';

import { TopographyType } from '@/config/topography/metadata';

export const topographySelectionAtom = atom<TopographyType>('elevation');
