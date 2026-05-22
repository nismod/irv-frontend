import { ValueLabel } from '@/lib/controls/params/value-label';

import type { DataSourceMetadataModule } from '../data-source-metadata-types';

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

export const REGIONAL_RISK_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'regional-summary',
    section: 'risk',
    dataset: 'Regional Summary',
    source: {
      label: 'Derived from exposure and hazard layers',
    },
    citation: ['GEM (2022) Analysis of earthquake and flooding population exposure.'],
    license: {
      label: 'CC-BY-SA',
    },
    notes: ['Population exposed to various hazards at return periods.'],
  },
];
