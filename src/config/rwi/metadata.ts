import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const RWI_LAYER_METADATA = [
  {
    id: 'relative-wealth-index',
    title: 'Relative Wealth Index',
    description:
      'The Relative Wealth Index predicts the relative standard of living within countries using privacy protecting connectivity data, satellite imagery, and other novel data sources.',
    risk_data_type: ['vulnerability'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Meta Data for Good' },
    contact_point: { name: 'G. Chi' },
    creator: { name: 'G. Chi' },
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    resources: [
      {
        id: 'source_relative_wealth_index',
        title: 'Meta Relative Wealth Index',
        description: '',
        access_url: 'https://dataforgood.facebook.com/dfg/tools/relative-wealth-index',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_relative_wealth_index_citation_1',
          name: 'Chi, G., et al. 2022. Microestimates of wealth for all low- and middle-income countries. Proceedings of the National Academy of Sciences Jan 2022, 119 (3) e2113658119; DOI: 10.1073/pnas.2113658119. Data available at: https://data.humdata.org/dataset/relative-wealth-index.',
          type: 'dataset',
          risk_data_type: ['vulnerability'],
          license: 'https://creativecommons.org/licenses/by-nc/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
