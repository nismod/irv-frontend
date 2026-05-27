import { ValueLabel } from '@/lib/controls/params/value-label';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import {
  citationSources,
  GLOBAL_SPATIAL,
  SOURCE_DATASET_LINEAGE_DESCRIPTION,
} from '../layer-metadata-helpers';

export const REGIONAL_EXPOSURE_VARIABLES = [
  'pop_exposed_seismic_threshold0.1g',
  'pop_exposed_seismic_threshold0.2g',
  'pop_exposed_river_historical_WATCH_1980_thresholdNone',
  'pop_exposed_river_rcp4p5_MIROC-ESM-CHEM_2050_thresholdNone',
] as const;

export type RegionalExposureVariableType = (typeof REGIONAL_EXPOSURE_VARIABLES)[number];

export const REGIONAL_EXPOSURE_VARIABLE_LABELS: ValueLabel<RegionalExposureVariableType>[] = [
  {
    value: 'pop_exposed_seismic_threshold0.1g',
    label: 'Seismic hazard >0.1g',
  },
  {
    value: 'pop_exposed_seismic_threshold0.2g',
    label: 'Seismic hazard >0.2g',
  },
  {
    value: 'pop_exposed_river_historical_WATCH_1980_thresholdNone',
    label: 'River flooding (baseline, 100yr)',
  },
  {
    value: 'pop_exposed_river_rcp4p5_MIROC-ESM-CHEM_2050_thresholdNone',
    label: 'River flooding (RCP4.5, 2050, 100yr)',
  },
];

export const REGIONAL_RISK_LAYER_METADATA = [
  {
    id: 'regional-summary',
    title: 'Regional Summary',
    description: 'Population exposed to various hazards at return periods.',
    risk_data_type: ['loss'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Global Earthquake Model' },
    contact_point: { name: 'Global Earthquake Model' },
    creator: { name: 'Global Earthquake Model' },
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    resources: [
      {
        id: 'source_regional_summary',
        title: 'Derived from exposure and hazard layers',
        description: '',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: citationSources(
        'source_regional_summary_citation',
        ['GEM (2022) Analysis of earthquake and flooding population exposure.'],
        {
          type: 'dataset',
          risk_data_type: 'loss',
          license: 'https://creativecommons.org/licenses/by-sa/4.0/',
        },
      ),
    },
  },
] as const satisfies readonly RdlsDataset[];
