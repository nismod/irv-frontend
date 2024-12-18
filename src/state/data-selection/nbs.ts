import { Feature } from 'geojson';
import { atom, selector } from 'recoil';

import { ScopeSpec } from '@/lib/asset-list/use-sorted-features';
import { BoundingBox, extendBbox, geoJsonToAppBoundingBox } from '@/lib/bounding-box';
import { selectionState } from '@/lib/data-map/interactions/interaction-state';
import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { ColorSpec, FieldSpec, StyleParams } from '@/lib/data-map/view-layers';

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

export const nbsSelectedScopeRegionState = selector<Feature | null>({
  key: 'nbsSelectedScopeRegionState',
  get: ({ get }) => {
    const nbsRegionSelection = get(
      selectionState('scope_regions'),
    ) as InteractionTarget<VectorTarget>;
    return nbsRegionSelection?.target.feature ?? null;
  },
});

export const nbsSelectedScopeRegionBboxState = selector<BoundingBox | null>({
  key: 'nbsSelectedScopeRegionBboxState',
  get: ({ get }) => {
    const selectedRegion = get(nbsSelectedScopeRegionState);
    if (!selectedRegion) {
      return null;
    }

    const geom = selectedRegion?.geometry;
    const bbox = extendBbox(geoJsonToAppBoundingBox(geom), 5);

    return bbox;
  },
});

export const nbsSelectedScopeRegionIdState = selector<number | string | null>({
  key: 'nbsSelectedScopeRegionIdState',
  get: ({ get }) => {
    const selectedRegion = get(nbsSelectedScopeRegionState);
    const idProperty = get(nbsRegionScopeLevelIdPropertyState);

    if (!selectedRegion || !idProperty) {
      return null;
    }

    return selectedRegion.properties[idProperty];
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

export const nbsAdaptationScopeSpecState = selector<ScopeSpec>({
  key: 'nbsAdaptationScopeSpecState',
  get: ({ get }) => {
    const idProperty = get(nbsRegionScopeLevelIdPropertyState);
    const selectedRegionId = get(nbsSelectedScopeRegionIdState);

    if (!idProperty || !selectedRegionId) {
      return null;
    }

    return {
      [idProperty]: selectedRegionId,
    };
  },
});

export const nbsShouldMapAdaptationDataState = selector<boolean>({
  key: 'nbsShouldMapDataState',
  get: ({ get }) => {
    const nbsVariable = get(nbsVariableState);
    return nbsVariable !== 'landuse_type';
  },
});

export const nbsFieldSpecState = selector<FieldSpec>({
  key: 'nbsFieldSpecState',
  get: ({ get }) => {
    if (!get(nbsShouldMapAdaptationDataState)) {
      return null;
    }
    const nbsVariable = get(nbsVariableState);
    const nbsAdaptationHazard = get(nbsAdaptationHazardState);

    return {
      fieldGroup: 'adaptation',
      field: nbsVariable,
      fieldDimensions: {
        hazard: nbsAdaptationHazard,
        rcp: 'baseline',
        adaptation_name: 'standard',
        adaptation_protection_level: 100,
      },
      fieldParams: {},
    };
  },
});

export const nbsColorSpecState = selector<ColorSpec>({
  key: 'nbsColorSpecState',
  get: ({ get }) => {
    if (!get(nbsShouldMapAdaptationDataState)) {
      return null;
    }

    const nbsVariable = get(nbsVariableState);

    return NBS_ADAPTATION_COLORMAPS[nbsVariable];
  },
});

export const nbsStyleParamsState = selector<StyleParams>({
  key: 'nbsStyleParamsState',
  get: ({ get }) => {
    if (!get(nbsShouldMapAdaptationDataState)) {
      return {};
    }

    const fieldSpec = get(nbsFieldSpecState);
    const colorSpec = get(nbsColorSpecState);

    return {
      colorMap: {
        colorSpec,
        fieldSpec,
      },
    };
  },
});
