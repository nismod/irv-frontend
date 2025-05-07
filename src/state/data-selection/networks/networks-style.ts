import { selector } from 'recoil';

import { showInfrastructureDamagesState } from '../damage-mapping/damage-map';

export const networksStyleState = selector<string>({
  key: 'networksStyleState',
  get: ({ get }) => (get(showInfrastructureDamagesState) ? 'damages' : 'type'),
});
