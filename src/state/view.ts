import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';

export type ViewType = 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'adaptation';

export const viewState = atom<ViewType>({
  key: 'viewState',
  effects: [
    syncEffect({
      storeKey: 'map-view-route',
      itemKey: 'view',
      refine: string(),
    }),
  ],
});
