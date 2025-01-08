import { ValueLabel } from '@/lib/controls/params/value-label';
import { makeConfig, makeOptions } from '@/lib/helpers';

import { AssetMetadata } from '../assets/metadata';
import { NBS_LANDUSE_COLORS } from './colors';

export const NBS_ADAPTATION_TYPES = ['standard'] as const;

export type NbsAdaptationType = (typeof NBS_ADAPTATION_TYPES)[number];

export const NBS_ADAPTATION_TYPE_LABELS: ValueLabel<NbsAdaptationType>[] = [
  { value: 'standard', label: 'Tree Planting' },
];

export const NBS_REGION_SCOPE_LEVELS = ['adm0', 'adm1', 'adm2', 'hybas'] as const;

export type NbsRegionScopeLevel = (typeof NBS_REGION_SCOPE_LEVELS)[number];

export const NBS_REGION_SCOPE_LEVEL_METADATA = makeConfig<
  { label: string; idProperty: string },
  NbsRegionScopeLevel
>([
  {
    id: 'adm0',
    label: 'Country',
    idProperty: 'GID_0',
  },
  {
    id: 'adm1',
    label: 'Admin 1',
    idProperty: 'GID_1',
  },
  {
    id: 'adm2',
    label: 'Admin 2',
    idProperty: 'GID_2',
  },
  {
    id: 'hybas',
    label: 'Watershed',
    idProperty: 'HYBAS_ID',
  },
]);

export const NBS_REGION_SCOPE_LEVEL_LABELS = makeOptions(
  Object.keys(NBS_REGION_SCOPE_LEVEL_METADATA) as NbsRegionScopeLevel[],
  (x) => NBS_REGION_SCOPE_LEVEL_METADATA[x].label,
);

export const ADAPTATION_VARIABLES = [
  'landuse_type',
  'avoided_ead_mean',
  'adaptation_cost',
  'cost_benefit_ratio',
] as const;

export type AdaptationVariable = (typeof ADAPTATION_VARIABLES)[number];

export const ADAPTATION_VARIABLE_LABELS: ValueLabel<AdaptationVariable>[] = [
  {
    value: 'landuse_type',
    label: 'Type (Land Use)',
  },
  {
    value: 'avoided_ead_mean',
    label: 'Avoided EAD (mean)',
  },
  {
    value: 'adaptation_cost',
    label: 'Adaptation cost',
  },
  {
    value: 'cost_benefit_ratio',
    label: 'Cost-benefit ratio',
  },
];

export const NBS_HAZARD_TYPES = ['ls_eq', 'ls_rf', 'ls_sum'] as const;

export type NbsHazardType = (typeof NBS_HAZARD_TYPES)[number];

export const NBS_HAZARD_LABELS: ValueLabel<NbsHazardType>[] = [
  { value: 'ls_eq', label: 'Landslides (earthquakes)' },
  { value: 'ls_rf', label: 'Landslides (rainfalls)' },
  { value: 'ls_sum', label: 'Landslides (combined)' },
];

export const NBS_LANDUSE_TYPES = ['crops', 'other'] as const;

export type NbsLanduseType = (typeof NBS_LANDUSE_TYPES)[number];

export const NBS_LANDUSE_METADATA = makeConfig<AssetMetadata, NbsLanduseType>([
  {
    id: 'crops',
    type: 'polygon',
    label: 'Land Use (Crops)',
    color: NBS_LANDUSE_COLORS.crops.css,
  },
  {
    id: 'other',
    type: 'polygon',
    label: 'Land Use (Other)',
    color: NBS_LANDUSE_COLORS.other.css,
  },
]);
