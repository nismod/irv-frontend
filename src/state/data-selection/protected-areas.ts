import { atom } from 'jotai';

import { ProtectedAreaType } from '@/config/protected-areas/metadata';

export const protectedAreaTypeSelectionAtom = atom<Record<ProtectedAreaType, boolean>>({
  land: true,
  marine: true,
});
