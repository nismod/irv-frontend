import { atom, selector } from 'recoil';

import { selectionState } from '@/lib/data-map/interactions/interaction-state';
import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { StyleParams } from '@/lib/data-map/view-layers';

import { NBS_ADAPTATION_COLORMAPS } from '@/config/nbs/colors';
import {
  AdaptationVariable,
  NBS_REGION_SCOPE_LEVEL_METADATA,
  NbsHazardType,
  NbsRegionScopeLevel,
} from '@/config/nbs/metadata';

export const nbsRegionScopeLevelState = atom<NbsRegionScopeLevel>({
  key: 'nbsRegionScopeLevelState',
  default: 'adm1',
});

export const nbsRegionScopeLevelIdPropertyState = selector<string>({
  key: 'nbsRegionScopeLevelIdPropertyState',
  get: ({ get }) => {
    const nbsRegionScopeLevel = get(nbsRegionScopeLevelState);
    return NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.idProperty;
  },
});

export const nbsSelectedScopeRegionState = selector<number | string | null>({
  key: 'nbsSelectedScopeRegionState',
  get: ({ get }) => {
    const nbsRegionSelection = get(
      selectionState('scope_regions'),
    ) as InteractionTarget<VectorTarget>;
    const idProperty = get(nbsRegionScopeLevelIdPropertyState);

    if (!nbsRegionSelection || !idProperty) {
      return null;
    }

    return nbsRegionSelection.target.feature.properties[idProperty];
  },
});

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

    if (nbsVariable === 'landuse_type') {
      return {};
    }

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
