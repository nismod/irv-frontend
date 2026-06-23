import { atom } from 'jotai';

import { CDDType } from '@/config/cdd/metadata';

export const cddSelectionAtom = atom<CDDType>('absolute');
