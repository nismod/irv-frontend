import { Feature } from 'maplibre-gl';

import { ValueLabel } from '@/lib/controls/params/value-label';
import { GetColor } from '@/lib/deck/props/style';
import { FormatFunction, makeValueFormat } from '@/lib/formats';
import { makeConfig, makeOptions } from '@/lib/helpers';

import { AssetMetadata } from '../assets/metadata';
import { NBS_LANDUSE_COLORS, NBS_SHORELINE_COLORS } from './colors';

// === Adaptation Type ===

export const NBS_ADAPTATION_TYPES = [
  'slope_vegetation:natural_regeneration',
  'slope_vegetation:native_planting',
  'mangrove:natural_regeneration',
  'mangrove:native_planting',
  'catchment_restoration:natural_regeneration',
  'catchment_restoration:native_planting',
] as const;

export type NbsAdaptationType = (typeof NBS_ADAPTATION_TYPES)[number];

export const NBS_ADAPTATION_TYPE_LABELS: ValueLabel<NbsAdaptationType>[] = [
  {
    value: 'slope_vegetation:natural_regeneration',
    label: 'Slope vegetation (natural regeneration)',
  },
  {
    value: 'slope_vegetation:native_planting',
    label: 'Slope vegetation (native planting)',
  },
  {
    value: 'mangrove:natural_regeneration',
    label: 'Mangroves (natural regeneration)',
  },
  {
    value: 'mangrove:native_planting',
    label: 'Mangroves (native planting)',
  },
  {
    value: 'catchment_restoration:natural_regeneration',
    label: 'River catchment restoration (natural regeneration)',
  },
  {
    value: 'catchment_restoration:native_planting',
    label: 'River catchment restoration (native planting)',
  },
];

// === Adaptation Type Vector Tilesets ===

export const NBS_VECTOR_LAYER_PER_ADAPTATION_TYPE: Record<NbsAdaptationType, string> = {
  'slope_vegetation:natural_regeneration': 'nbs_ls',
  'slope_vegetation:native_planting': 'nbs_ls',
  'mangrove:natural_regeneration': 'nbs_cf',
  'mangrove:native_planting': 'nbs_cf',
  'catchment_restoration:natural_regeneration': 'nbs_rf',
  'catchment_restoration:native_planting': 'nbs_rf',
};

// === Geographic Scope ===

export const NBS_REGION_SCOPE_LEVELS = ['adm0', 'adm1', 'adm2', 'hybas'] as const;

export type NbsRegionScopeLevel = (typeof NBS_REGION_SCOPE_LEVELS)[number];

export const NBS_REGION_SCOPE_LEVEL_METADATA = makeConfig<
  { label: string; idProperty: string; nameProperty: string; labelMinZoom?: number },
  NbsRegionScopeLevel
>([
  {
    id: 'adm0',
    label: 'Country',
    idProperty: 'GID_0',
    nameProperty: 'NAME_0',
    labelMinZoom: 6,
  },
  {
    id: 'adm1',
    label: 'Admin 1',
    idProperty: 'GID_1',
    nameProperty: 'NAME_1',
    labelMinZoom: 6,
  },
  {
    id: 'adm2',
    label: 'Admin 2',
    idProperty: 'GID_2',
    nameProperty: 'NAME_2',
    labelMinZoom: 7,
  },
  {
    id: 'hybas',
    label: 'Watershed',
    idProperty: 'HYBAS_ID',
    nameProperty: 'HYBAS_ID',
    labelMinZoom: 9,
  },
]);

export const NBS_REGION_SCOPE_LEVEL_LABELS = makeOptions(
  Object.keys(NBS_REGION_SCOPE_LEVEL_METADATA) as NbsRegionScopeLevel[],
  (x) => NBS_REGION_SCOPE_LEVEL_METADATA[x].label,
);

// === Adaptation Variables ===

export interface NbsCategoricalConfig {
  getColor: GetColor;
  getMetadata: (f: Feature) => { label: string; color: string };
}

export interface NbsContinuousConfig {
  numberFormatFn?: FormatFunction<number>;
}

export const NBS_DATA_VARIABLES = [
  'slope_vegetation_landuse_type',
  'avoided_ead_mean',
  'adaptation_cost',
  'shoreline',
  'tree_suitability',
] as const;

export type NbsDataVariable = (typeof NBS_DATA_VARIABLES)[number];

export type NbsDataVariableMetadata = {
  label: string;
  /** Are the values of the variable dependent on hazard type? If yes, the hazard selection UI will be shown */
  showHazard: boolean;
} & (
  | {
      /** The variable values are categorical. Adaptation options table won't be shown */
      dataType: 'categorical';
      categoricalConfig: NbsCategoricalConfig;
    }
  | {
      /** The variable values are from a continuous, sortable domain - adaptation options table will be displayed,
       * and the continuous data will be visualised on the map
       */
      dataType: 'continuous';
      continuousConfig: NbsContinuousConfig;
    }
);

const dollarsFormatFn = makeValueFormat((x) => `$${x}`, { maximumFractionDigits: 0 });

export const NBS_DATA_VARIABLE_METADATA = makeConfig<NbsDataVariableMetadata, NbsDataVariable>([
  {
    id: 'slope_vegetation_landuse_type',
    label: 'Type (Land Use)',
    showHazard: false,
    dataType: 'categorical',
    categoricalConfig: {
      getColor: (f) => {
        const landuse_type = f.properties.option_landuse;
        return NBS_LANDUSE_COLORS[landuse_type]?.deck ?? [200, 200, 200];
      },
      getMetadata: (f) => {
        const landuse_type = f.properties.option_landuse;
        const { label, color } = NBS_LANDUSE_METADATA[landuse_type];
        return { label, color };
      },
    },
  },
  {
    id: 'shoreline',
    label: 'Type (Shoreline)',
    showHazard: false,
    dataType: 'categorical',
    categoricalConfig: {
      getColor: (f) => {
        const landuse_type = f.properties.option_shoreline;
        return NBS_LANDUSE_COLORS[landuse_type]?.deck ?? [200, 200, 200];
      },
      getMetadata: (f) => {
        const landuse_type = f.properties.option_shoreline;
        const { label, color } = NBS_LANDUSE_METADATA[landuse_type];
        return { label, color };
      },
    },
  },
  {
    id: 'avoided_ead_mean',
    label: 'Avoided EAD (mean)',
    showHazard: true,
    dataType: 'continuous',
    continuousConfig: {
      numberFormatFn: dollarsFormatFn,
    },
  },
  {
    id: 'adaptation_cost',
    label: 'Adaptation cost',
    showHazard: true,
    dataType: 'continuous',
    continuousConfig: {
      numberFormatFn: dollarsFormatFn,
    },
  },
]);

/**
 * For each adaptation type, which data variables should be available in the sidebar to select for plotting?
 */
export const NBS_DATA_VARIABLES_PER_ADAPTATION_TYPE: Record<NbsAdaptationType, NbsDataVariable[]> =
  {
    'slope_vegetation:natural_regeneration': [
      'slope_vegetation_landuse_type',
      'avoided_ead_mean',
      'adaptation_cost',
    ],
    'slope_vegetation:native_planting': [
      'slope_vegetation_landuse_type',
      'avoided_ead_mean',
      'adaptation_cost',
    ],
    'mangrove:natural_regeneration': ['shoreline', 'avoided_ead_mean', 'adaptation_cost'],
    'mangrove:native_planting': ['shoreline', 'avoided_ead_mean', 'adaptation_cost'],
    'catchment_restoration:natural_regeneration': ['avoided_ead_mean', 'adaptation_cost'],
    'catchment_restoration:native_planting': ['avoided_ead_mean', 'adaptation_cost'],
  };

/**
 * For each adaptation type, which categorical data variable should be treated as the primary one?
 * This is used for formatting the tooltip/details header when a continuous data variables is being plotted on the map.
 * There must be at least one categorical variable present for each adaptation type.
 */
export const NBS_PRIMARY_CATEGORICAL_VARIABLE_PER_ADAPTATION_TYPE: Record<
  NbsAdaptationType,
  NbsDataVariable
> = {
  'slope_vegetation:natural_regeneration': 'slope_vegetation_landuse_type',
  'slope_vegetation:native_planting': 'slope_vegetation_landuse_type',
  'mangrove:natural_regeneration': 'shoreline',
  'mangrove:native_planting': 'shoreline',
  'catchment_restoration:natural_regeneration': 'tree_suitability',
  'catchment_restoration:native_planting': 'tree_suitability',
};

// === Hazard Types ===

export const NBS_HAZARD_TYPES = ['ls', 'rf', 'cf'] as const;

export type NbsHazardType = (typeof NBS_HAZARD_TYPES)[number];

export const NBS_HAZARD_METADATA = makeConfig<{ label: string }, NbsHazardType>([
  { id: 'ls', label: 'Landslide' },
  { id: 'rf', label: 'River flooding' },
  { id: 'cf', label: 'Coastal flooding' },
]);

export const NBS_HAZARDS_PER_ADAPTATION_TYPE: Record<NbsAdaptationType, NbsHazardType[]> = {
  'slope_vegetation:natural_regeneration': ['ls'],
  'slope_vegetation:native_planting': ['ls'],
  'mangrove:natural_regeneration': ['cf'],
  'mangrove:native_planting': ['cf'],
  'catchment_restoration:natural_regeneration': ['rf'],
  'catchment_restoration:native_planting': ['rf'],
};

// === Slope vegetation: Land Use Types ===

export const NBS_LANDUSE_TYPES = ['crops', 'other', 'bare'] as const;

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
  {
    id: 'bare',
    type: 'polygon',
    label: 'Land Use (Bare)',
    color: NBS_LANDUSE_COLORS.bare.css,
  },
]);

// === Mangrove: Shoreline Types ===

export const NBS_SHORELINE_TYPES = ['accreting', 'retreating', 'fast_retreating'] as const;

export type NbsShorelineType = (typeof NBS_SHORELINE_TYPES)[number];

export const NBS_SHORELINE_METADATA = makeConfig<AssetMetadata, NbsShorelineType>([
  {
    id: 'accreting',
    type: 'polygon',
    label: 'Shoreline (accreting)',
    color: NBS_SHORELINE_COLORS.accreting.css,
  },
  {
    id: 'retreating',
    type: 'polygon',
    label: 'Shoreline (retreating)',
    color: NBS_SHORELINE_COLORS.retreating.css,
  },
  {
    id: 'fast_retreating',
    type: 'polygon',
    label: 'Shoreline (fast retreating)',
    color: NBS_SHORELINE_COLORS.fast_retreating.css,
  },
]);
