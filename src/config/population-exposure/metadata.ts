import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const POPULATION_EXPOSURE_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'population-exposure',
    section: 'risk',
    dataset: 'Population Exposure',
    source: {
      label: 'Derived from ISIMIP hazards and GHSL population',
    },
    citation: [
      'Russell, T., Nicholas, C., & Bernhofen, M. (2024). Annual probability of extreme heat and drought events, derived from Lange et al 2020 [Data set]. Zenodo. 10.5281/zenodo.11582369. Derived using https://github.com/nismod/isimip-exposure.',
    ],
    license: {
      label: 'CC BY-SA 4.0 International',
    },
    notes: [
      'Population exposure is calculated as annual expected population directly exposed to the occurrence of extreme heat or drought events, assuming any population directly within the footprint of an event is exposed, but not otherwise taking any other risk-mitigating or -propagating factors into account.',
    ],
  },
];
