import { atom } from 'recoil';

import { TopographyType } from '@/config/topography/metadata';

export const topographySelectionState = atom<TopographyType>({
  key: 'topographySelectionState',
  default: 'elevation',
});
