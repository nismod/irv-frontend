import { atom } from 'recoil';

export enum TopographyType {
  slope,
  elevation,
}

export const topographySelectionState = atom<TopographyType>({
  key: 'topographySelectionState',
  default: TopographyType.slope,
});
