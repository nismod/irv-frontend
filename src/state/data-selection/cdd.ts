import { atom } from 'recoil';

import { CDDType } from '@/config/cdd/metadata';

export const cddSelectionState = atom<CDDType>({
  key: 'cddSelectionState',
  default: 'absolute',
});
