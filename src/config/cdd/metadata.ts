import { ValueLabel } from '@/lib/controls/params/value-label';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const METRIC_TYPES = ['absolute', 'relative'] as const;

export type CDDType = (typeof METRIC_TYPES)[number];

export const METRIC_VALUE_LABELS: ValueLabel<CDDType>[] = [
  {
    value: 'absolute',
    label: 'Mean absolute Change (days per year)',
  },
  {
    value: 'relative',
    label: 'Relative Change',
  },
];

export const CDD_LAYER_METADATA = [
  {
    id: 'cdd_miranda',
    title: 'Cooling demand',
    description:
      'Absolute and relative mean increase of cooling degree days (CDDs) from 1.5C to 2C global warming scenarios. Additionally, the standard deviation is provided. The data has a horizontal resolution of 0.833 longitude and 0.556 latitude over the land surface. These annual CDDs and standard deviation globally were calculated using an ensemble of 700 simulations per climate change scenario. Cooling degree days were calculated for the ensemble members using the temperature threshold of 18C. Then, annual mean CDDs and standard deviation per coordinate across ensemble members were obtained for the 1.5C and 2C scenarios. Finally, absolute and relative differences between 1.5C and 2C were computed. The climate data, involving 700 simulations per scenario, was generated using the HadAM4P Atmosphere-only General Circulation Model (AGCM) from the UK Met Office Hadley Centre. Three scenarios were generated: historical (2006-16), 1.5C and 2C. The simulation outputs were mean temperatures with a 6-hour timestep and a horizontal resolution of 0.833 longitude and 0.556 latitude. Simulations took place within climateprediction.net (CPDN) climate simulation, which uses the Berkeley Open Infrastructure for Network Computing (BOINC) framework. Biases in simulated temperature were identified and corrected using a quantile mapping approach.',
    risk_data_type: ['loss'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'University of Oxford' },
    contact_point: { name: 'N.D. Miranda' },
    creator: { name: 'N.D. Miranda' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_cooling_degree_days',
        title: 'Global CDD difference between 1.5C and 2C global warming scenarios.',
        description: '',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_cooling_degree_days',
          name: 'Miranda, N.D., Lizana, J., Sparrow, S.N. et al. (2023) Change in cooling degree days with global mean temperature rise increasing from 1.5C to 2.0C. Nature Sustainability 6, 1326-1330. DOI 10.1038/s41893-023-01155-z.',
          url: 'https://doi.org/10.1038/s41893-023-01155-z',
          type: 'dataset',
          risk_data_type: 'loss',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_cooling_degree_days_data',
          name: 'Miranda, N. D., Lizana, J., Sparrow, S. N., Wallom, D. C. H., Zachau-Walker, M., Watson, P., Khosla, R., & McCulloch, M. (2023). Changes in Cooling Degree Days (CDD) between the 1.5C and 2.0C global warming scenarios. University of Oxford. https://ora.ox.ac.uk/objects/uuid:8d95c423-816c-4a4f-88b6-eb7a040cb40e.',
          type: 'dataset',
          risk_data_type: 'loss',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
