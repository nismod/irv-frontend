import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const HDI_GRID_LAYER_METADATA = [
  {
    id: 'hdi-grid',
    title: 'Human Development (Grid)',
    description:
      'Global estimates of United Nations Human Development Index (HDI) on a global 0.1 degree grid. Developed using a generalizable machine learning downscaling technique based on satellite imagery that allows for training and prediction with observations of arbitrary shape and size. This downscales the national HDI, which is a multi-dimensional index used for measuring national development, incorporating measures of income, education and health.',
    risk_data_type: ['vulnerability'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Global Policy Lab' },
    contact_point: { name: 'L. Sherman' },
    creator: { name: 'L. Sherman' },
    license: 'https://spdx.org/licenses/MIT',
    resources: [
      {
        id: 'source_hdi_grid',
        title: 'Global High-Resolution Estimates of the United Nations Human Development Index',
        description: '',
        access_url: 'https://www.mosaiks.org/hdi',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_hdi_grid_citation_1',
          name: 'Sherman, L., et al. 2023. Global High-Resolution Estimates of the United Nations Human Development Index Using Satellite Imagery and Machine-learning. Working Paper Series. 31044. National Bureau of Economic Research. DOI: https://doi.org/10.3386/w31044. Available online: http://www.nber.org/papers/w31044 Data available at: https://github.com/Global-Policy-Lab/hdi_downscaling_mosaiks',
          type: 'dataset',
          risk_data_type: ['vulnerability'],
          license: 'https://spdx.org/licenses/MIT',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
