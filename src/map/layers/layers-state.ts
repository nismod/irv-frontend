import { atom } from 'jotai';

import { BackgroundName } from '@/config/basemaps';

export const backgroundAtom = atom<BackgroundName>('light');

export const showLabelsAtom = atom<boolean>(true);
