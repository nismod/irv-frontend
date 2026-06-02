import { atom } from 'jotai';

import { TraveltimeType } from '@/config/travel-time/travel-time-layer';

export const travelTimeTypeAtom = atom<TraveltimeType>('motorized');
