import { atom, selector } from 'recoil';

import { StyleParams } from '@/lib/data-map/view-layers';

import { NBS_ADAPTATION_COLORMAPS } from '@/config/nbs/colors';
import { AdaptationVariable, NbsHazardType } from '@/config/nbs/metadata';

export const nbsVariableState = atom<AdaptationVariable>({
  key: 'nbsVariableState',
  default: 'avoided_ead_mean',
});

export const nbsAdaptationHazardState = atom<NbsHazardType>({
  key: 'nbsAdaptationHazardState',
  default: 'ls_sum',
});

export const nbsStyleParamsState = selector<StyleParams>({
  key: 'nbsStyleParamsState',
  get: ({ get }) => {
    const nbsVariable = get(nbsVariableState);
    const nbsAdaptationHazard = get(nbsAdaptationHazardState);

    return {
      colorMap: {
        colorSpec: NBS_ADAPTATION_COLORMAPS[nbsVariable],
        fieldSpec: {
          fieldGroup: 'adaptation',
          field: nbsVariable,
          fieldDimensions: {
            hazard: nbsAdaptationHazard,
            rcp: 'baseline',
            adaptation_name: 'standard',
            adaptation_protection_level: 100,
          },
          fieldParams: {},
        },
      },
    };
  },
});
