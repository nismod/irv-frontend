import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const TRAVEL_TIME_LAYER_METADATA = [
  {
    id: 'travel-time-healthcare',
    title: 'Access to Healthcare',
    description: 'Motorised/non-motorised travel time on 30arcsec grid.',
    risk_data_type: ['vulnerability'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'D.J. Weiss' },
    contact_point: { name: 'D.J. Weiss' },
    creator: { name: 'D.J. Weiss' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_travel_time_healthcare',
        title: 'Global maps of travel time to healthcare facilities',
        description: '',
        access_url: 'https://www.nature.com/articles/s41591-020-1059-1',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_travel_time_healthcare_citation_1',
          name: 'Weiss, D.J., Nelson, A., Vargas-Ruiz, C.A. et al. Global maps of travel time to healthcare facilities. Nat Med 26, 1835-1838 (2020). DOI: 10.1038/s41591-020-1059-1.',
          type: 'dataset',
          risk_data_type: ['vulnerability'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
