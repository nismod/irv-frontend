import { atom } from 'jotai';

import { showInfrastructureDamagesAtom } from '../damage-mapping/damage-map';

export const networksStyleAtom = atom((get) =>
  get(showInfrastructureDamagesAtom) ? 'damages' : 'type',
);
