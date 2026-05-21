import { atom as jotaiAtom } from 'jotai';
import { atom, selector } from 'recoil';

import { LayerSpec, ScopeSpec } from '@/lib/asset-list/use-sorted-features';
import { bboxWktToAppBoundingBox, extendBbox } from '@/lib/bounding-box';
import { selectionAtomFamily } from '@/lib/data-map/interactions/interaction-state';
import { InteractionTarget, VectorTarget } from '@/lib/data-map/interactions/types';
import { ColorSpec, FieldSpec, StyleParams } from '@/lib/data-map/view-layers';

import { NBS_ADAPTATION_COLORMAPS } from '@/config/nbs/colors';
import {
  NBS_DATA_VARIABLE_METADATA,
  NBS_PRIMARY_CATEGORICAL_VARIABLE_PER_ADAPTATION_TYPE,
  NBS_REGION_SCOPE_LEVEL_METADATA,
  NBS_VECTOR_LAYER_PER_ADAPTATION_TYPE,
  NbsAdaptationType,
  NbsCategoricalConfig,
  NbsDataVariable,
  NbsHazardType,
  NbsRegionScopeLevel,
} from '@/config/nbs/metadata';

export const nbsAdaptationTypeState = atom<NbsAdaptationType>({
  key: 'nbsAdaptationTypeState',
  default: 'slope_vegetation:natural_regeneration',
});

export const nbsRegionScopeLevelState = atom<NbsRegionScopeLevel>({
  key: 'nbsRegionScopeLevelState',
  default: 'adm0',
});

export const nbsRegionScopeLevelIdPropertyState = selector<string>({
  key: 'nbsRegionScopeLevelIdPropertyState',
  get: ({ get }) => {
    const nbsRegionScopeLevel = get(nbsRegionScopeLevelState);
    return NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.idProperty;
  },
});

// === NBS Selected Region State (Jotai — reads Jotai selectionAtomFamily) ===

/**
 * Recoil↔Jotai migration: scope level is still edited via Recoil `nbsRegionScopeLevelState`;
 * NbsAdaptationSection syncs the current value here for Jotai derived atoms below.
 */
export const nbsRegionScopeLevelReplicaAtom = jotaiAtom<NbsRegionScopeLevel>('adm0');

export const nbsSelectedScopeRegionAtom = jotaiAtom((get) => {
  const nbsRegionSelection = get(
    selectionAtomFamily('scope_regions'),
  ) as InteractionTarget<VectorTarget> | null;
  return nbsRegionSelection?.target.feature ?? null;
});

export const nbsSelectedScopeRegionBboxAtom = jotaiAtom((get) => {
  const selectedRegion = get(nbsSelectedScopeRegionAtom);
  if (!selectedRegion) {
    return null;
  }

  return extendBbox(bboxWktToAppBoundingBox(selectedRegion.properties.bbox_wkt), 5);
});

export const nbsSelectedScopeRegionIdAtom = jotaiAtom((get) => {
  const selectedRegion = get(nbsSelectedScopeRegionAtom);
  const nbsRegionScopeLevel = get(nbsRegionScopeLevelReplicaAtom);
  const idProperty = NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.idProperty;

  if (!selectedRegion || !idProperty) {
    return null;
  }

  return selectedRegion.properties[idProperty];
});

export const nbsSelectedScopeRegionNameAtom = jotaiAtom((get) => {
  const selectedRegion = get(nbsSelectedScopeRegionAtom);
  const nbsRegionScopeLevel = get(nbsRegionScopeLevelReplicaAtom);
  const nameProperty = NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.nameProperty;

  if (!selectedRegion || !nameProperty) {
    return null;
  }

  return selectedRegion.properties[nameProperty] ?? null;
});

export const nbsAdaptationScopeSpecAtom = jotaiAtom((get): ScopeSpec | null => {
  const nbsRegionScopeLevel = get(nbsRegionScopeLevelReplicaAtom);
  const idProperty = NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.idProperty;
  const selectedRegionId = get(nbsSelectedScopeRegionIdAtom);

  if (!idProperty || !selectedRegionId) {
    return null;
  }

  return {
    [idProperty]: selectedRegionId,
  };
});

// === NBS Adaptation Hazard State ===

export const nbsAdaptationHazardState = atom<NbsHazardType>({
  key: 'nbsAdaptationHazardState',
  default: 'ls',
});

// === NBS Data Variable State ===

export const nbsVariableState = atom<NbsDataVariable>({
  key: 'nbsVariableState',
  default: 'avoided_ead_mean',
});

export const nbsIsDataVariableContinuous = selector<boolean>({
  key: 'nbsIsDataVariableContinuous',
  get: ({ get }) => {
    const nbsVariable = get(nbsVariableState);
    return NBS_DATA_VARIABLE_METADATA[nbsVariable]?.dataType === 'continuous';
  },
});

export const nbsLayerSpecState = selector<LayerSpec>({
  key: 'nbsLayerSpecState',
  get: ({ get }) => {
    if (!get(nbsIsDataVariableContinuous)) {
      return null;
    }

    return {
      layer: NBS_VECTOR_LAYER_PER_ADAPTATION_TYPE[get(nbsAdaptationTypeState)],
    };
  },
});

export const nbsFieldSpecState = selector<FieldSpec>({
  key: 'nbsFieldSpecState',
  get: ({ get }) => {
    if (!get(nbsIsDataVariableContinuous)) {
      return null;
    }
    const nbsAdaptationType = get(nbsAdaptationTypeState);
    const nbsVariable = get(nbsVariableState);
    const nbsAdaptationHazard = get(nbsAdaptationHazardState);

    return {
      fieldGroup: 'adaptation',
      field: nbsVariable,
      fieldDimensions: {
        hazard: nbsAdaptationHazard,
        rcp: 'baseline',
        adaptation_name: nbsAdaptationType,
        adaptation_protection_level: 1,
      },
      fieldParams: {},
    };
  },
});

export const nbsColorSpecState = selector<ColorSpec>({
  key: 'nbsColorSpecState',
  get: ({ get }) => {
    if (!get(nbsIsDataVariableContinuous)) {
      return null;
    }

    const nbsVariable = get(nbsVariableState);

    return NBS_ADAPTATION_COLORMAPS[nbsVariable];
  },
});

export const nbsStyleParamsState = selector<StyleParams>({
  key: 'nbsStyleParamsState',
  get: ({ get }) => {
    if (!get(nbsIsDataVariableContinuous)) {
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

const nbsPrimaryCategoricalVariableState = selector<NbsDataVariable>({
  key: 'nbsPrimaryCategoricalVariableState',
  get: ({ get }) => {
    const nbsAdaptationType = get(nbsAdaptationTypeState);
    return NBS_PRIMARY_CATEGORICAL_VARIABLE_PER_ADAPTATION_TYPE[nbsAdaptationType];
  },
});

export const nbsCategoricalConfigState = selector<NbsCategoricalConfig>({
  key: 'nbsCategoricalConfigState',
  get: ({ get }) => {
    const nbsVariable = get(nbsVariableState);
    const variableMeta = NBS_DATA_VARIABLE_METADATA[nbsVariable];
    if (variableMeta.dataType === 'categorical') {
      return variableMeta.categoricalConfig;
    } else {
      const primaryCategoricalVariable = get(nbsPrimaryCategoricalVariableState);

      const categoricalVarMeta = NBS_DATA_VARIABLE_METADATA[primaryCategoricalVariable];

      if (categoricalVarMeta.dataType !== 'categorical') {
        return null;
      }

      return categoricalVarMeta.categoricalConfig;
    }
  },
});
