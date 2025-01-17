import { Feature } from 'maplibre-gl';

import { ValueLabel } from '@/lib/controls/params/value-label';
import { GetColor } from '@/lib/deck/props/style';
import { FormatFunction, makeValueFormat } from '@/lib/formats';
import { makeConfig, makeOptions } from '@/lib/helpers';

import { AssetMetadata } from '../assets/metadata';
import { NBS_LANDUSE_COLORS } from './colors';

// === Adaptation Type ===

export const NBS_ADAPTATION_TYPES = ['tree_planting'] as const;

export type NbsAdaptationType = (typeof NBS_ADAPTATION_TYPES)[number];

export const NBS_ADAPTATION_TYPE_LABELS: ValueLabel<NbsAdaptationType>[] = [
  { value: 'tree_planting', label: 'Tree Planting' },
];

// === Adaptation Type Vector Tilesets ===

export const NBS_VECTOR_LAYER_PER_ADAPTATION_TYPE: Record<NbsAdaptationType, string> = {
  tree_planting: 'nbs',
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
  },
  {
    id: 'adm1',
    label: 'Admin 1',
    idProperty: 'GID_1',
    nameProperty: 'NAME_1',
  },
  {
    id: 'adm2',
    label: 'Admin 2',
    idProperty: 'GID_2',
    nameProperty: 'NAME_2',
    labelMinZoom: 10,
  },
  {
    id: 'hybas',
    label: 'Watershed',
    idProperty: 'HYBAS_ID',
    nameProperty: 'HYBAS_ID',
    labelMinZoom: 10,
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
  'tree_planting_landuse_type',
  'avoided_ead_mean',
  'adaptation_cost',
  'cost_benefit_ratio',
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
    id: 'tree_planting_landuse_type',
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
  {
    id: 'cost_benefit_ratio',
    label: 'Cost-benefit ratio',
    showHazard: true,
    dataType: 'continuous',
    continuousConfig: {},
  },
]);

/**
 * For each adaptation type, which data variables should be available in the sidebar to select for plotting?
 */
export const NBS_DATA_VARIABLES_PER_ADAPTATION_TYPE: Record<NbsAdaptationType, NbsDataVariable[]> =
  {
    tree_planting: [
      'tree_planting_landuse_type',
      'avoided_ead_mean',
      'adaptation_cost',
      'cost_benefit_ratio',
    ],
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
  tree_planting: 'tree_planting_landuse_type',
};

// === Hazard Types ===

export const NBS_HAZARD_TYPES = ['ls_eq', 'ls_rf', 'ls_sum'] as const;

export type NbsHazardType = (typeof NBS_HAZARD_TYPES)[number];

export const NBS_HAZARD_METADATA = makeConfig<{ label: string }, NbsHazardType>([
  {
    id: 'ls_eq',
    label: 'Landslides (earthquakes)',
  },
  {
    id: 'ls_rf',
    label: 'Landslides (rainfalls)',
  },
  {
    id: 'ls_sum',
    label: 'Landslides (combined)',
  },
]);

export const NBS_HAZARDS_PER_ADAPTATION_TYPE: Record<NbsAdaptationType, NbsHazardType[]> = {
  tree_planting: ['ls_eq', 'ls_rf', 'ls_sum'],
};

// === Tree Planting: Land Use Types ===

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
