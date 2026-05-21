import { atom } from 'jotai';

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

export const nbsAdaptationTypeAtom = atom<NbsAdaptationType>(
  'slope_vegetation:natural_regeneration',
);

export const nbsRegionScopeLevelAtom = atom<NbsRegionScopeLevel>('adm0');

export const nbsRegionScopeLevelIdPropertyAtom = atom((get) => {
  const nbsRegionScopeLevel = get(nbsRegionScopeLevelAtom);
  return NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.idProperty;
});

export const nbsSelectedScopeRegionAtom = atom((get) => {
  const nbsRegionSelection = get(
    selectionAtomFamily('scope_regions'),
  ) as InteractionTarget<VectorTarget> | null;
  return nbsRegionSelection?.target.feature ?? null;
});

export const nbsSelectedScopeRegionBboxAtom = atom((get) => {
  const selectedRegion = get(nbsSelectedScopeRegionAtom);
  if (!selectedRegion) {
    return null;
  }

  return extendBbox(bboxWktToAppBoundingBox(selectedRegion.properties.bbox_wkt), 5);
});

export const nbsSelectedScopeRegionIdAtom = atom((get) => {
  const selectedRegion = get(nbsSelectedScopeRegionAtom);
  const nbsRegionScopeLevel = get(nbsRegionScopeLevelAtom);
  const idProperty = NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.idProperty;

  if (!selectedRegion || !idProperty) {
    return null;
  }

  return selectedRegion.properties[idProperty];
});

export const nbsSelectedScopeRegionNameAtom = atom((get) => {
  const selectedRegion = get(nbsSelectedScopeRegionAtom);
  const nbsRegionScopeLevel = get(nbsRegionScopeLevelAtom);
  const nameProperty = NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.nameProperty;

  if (!selectedRegion || !nameProperty) {
    return null;
  }

  return selectedRegion.properties[nameProperty] ?? null;
});

export const nbsAdaptationScopeSpecAtom = atom((get): ScopeSpec | null => {
  const nbsRegionScopeLevel = get(nbsRegionScopeLevelAtom);
  const idProperty = NBS_REGION_SCOPE_LEVEL_METADATA[nbsRegionScopeLevel]?.idProperty;
  const selectedRegionId = get(nbsSelectedScopeRegionIdAtom);

  if (!idProperty || !selectedRegionId) {
    return null;
  }

  return {
    [idProperty]: selectedRegionId,
  };
});

export const nbsAdaptationHazardAtom = atom<NbsHazardType>('ls');

export const nbsVariableAtom = atom<NbsDataVariable>('avoided_ead_mean');

export const nbsIsDataVariableContinuousAtom = atom((get) => {
  const nbsVariable = get(nbsVariableAtom);
  return NBS_DATA_VARIABLE_METADATA[nbsVariable]?.dataType === 'continuous';
});

export const nbsLayerSpecAtom = atom((get): LayerSpec => {
  if (!get(nbsIsDataVariableContinuousAtom)) {
    return null;
  }

  return {
    layer: NBS_VECTOR_LAYER_PER_ADAPTATION_TYPE[get(nbsAdaptationTypeAtom)],
  };
});

export const nbsFieldSpecAtom = atom((get): FieldSpec => {
  if (!get(nbsIsDataVariableContinuousAtom)) {
    return null;
  }
  const nbsAdaptationType = get(nbsAdaptationTypeAtom);
  const nbsVariable = get(nbsVariableAtom);
  const nbsAdaptationHazard = get(nbsAdaptationHazardAtom);

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
});

export const nbsColorSpecAtom = atom((get): ColorSpec => {
  if (!get(nbsIsDataVariableContinuousAtom)) {
    return null;
  }

  const nbsVariable = get(nbsVariableAtom);

  return NBS_ADAPTATION_COLORMAPS[nbsVariable];
});

export const nbsStyleParamsAtom = atom((get): StyleParams => {
  if (!get(nbsIsDataVariableContinuousAtom)) {
    return {};
  }

  const fieldSpec = get(nbsFieldSpecAtom);
  const colorSpec = get(nbsColorSpecAtom);

  return {
    colorMap: {
      colorSpec,
      fieldSpec,
    },
  };
});

const nbsPrimaryCategoricalVariableAtom = atom((get) => {
  const nbsAdaptationType = get(nbsAdaptationTypeAtom);
  return NBS_PRIMARY_CATEGORICAL_VARIABLE_PER_ADAPTATION_TYPE[nbsAdaptationType];
});

export const nbsCategoricalConfigAtom = atom((get): NbsCategoricalConfig => {
  const nbsVariable = get(nbsVariableAtom);
  const variableMeta = NBS_DATA_VARIABLE_METADATA[nbsVariable];
  if (variableMeta.dataType === 'categorical') {
    return variableMeta.categoricalConfig;
  }

  const primaryCategoricalVariable = get(nbsPrimaryCategoricalVariableAtom);
  const categoricalVarMeta = NBS_DATA_VARIABLE_METADATA[primaryCategoricalVariable];

  if (categoricalVarMeta.dataType !== 'categorical') {
    return null;
  }

  return categoricalVarMeta.categoricalConfig;
});
