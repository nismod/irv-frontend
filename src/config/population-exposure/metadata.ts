import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import {
  citationSources,
  GLOBAL_SPATIAL,
  SOURCE_DATASET_LINEAGE_DESCRIPTION,
} from '../layer-metadata-helpers';

export const POPULATION_EXPOSURE_LAYER_METADATA = [
  {
    id: 'population-exposure',
    title: 'Population Exposure',
    description:
      'Population exposure is calculated as annual expected population directly exposed to the occurrence of extreme heat or drought events, assuming any population directly within the footprint of an event is exposed, but not otherwise taking any other risk-mitigating or -propagating factors into account.',
    risk_data_type: ['loss'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'OPSIS, University of Oxford' },
    contact_point: { name: 'Tom Russell' },
    creator: { name: 'Tom Russell' },
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    resources: [
      {
        id: 'source_population_exposure',
        title: 'Derived from ISIMIP hazards and GHSL population',
        description: '',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: citationSources(
        'source_population_exposure_citation',
        [
          'Russell, T., Nicholas, C., & Bernhofen, M. (2024). Annual probability of extreme heat and drought events, derived from Lange et al 2020 [Data set]. Zenodo. 10.5281/zenodo.11582369. Derived using https://github.com/nismod/isimip-exposure.',
        ],
        {
          type: 'dataset',
          risk_data_type: 'loss',
          license: 'https://creativecommons.org/licenses/by-sa/4.0/',
        },
      ),
    },
  },
] as const satisfies readonly RdlsDataset[];
