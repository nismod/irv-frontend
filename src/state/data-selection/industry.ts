import { atom } from 'jotai';

export const INDUSTRY_TYPES = ['cement', 'steel'] as const;

export type IndustryType = (typeof INDUSTRY_TYPES)[number];

export type IndustrySelection = Record<IndustryType, boolean>;

export const industrySelectionAtom = atom<IndustrySelection>({
  cement: true,
  steel: true,
});
