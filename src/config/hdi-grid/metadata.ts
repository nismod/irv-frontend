import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const HDI_GRID_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'hdi-grid',
    section: 'vulnerability',
    dataset: 'Human Development (Grid)',
    source: {
      label: 'Global High-Resolution Estimates of the United Nations Human Development Index',
      url: 'https://www.mosaiks.org/hdi',
    },
    citation: [
      'Sherman, L., et al. 2023. Global High-Resolution Estimates of the United Nations Human Development Index Using Satellite Imagery and Machine-learning. Working Paper Series. 31044. National Bureau of Economic Research. DOI: 10.3386/w31044. Available online: http://www.nber.org/papers/w31044. Data available at: https://github.com/Global-Policy-Lab/hdi_downscaling_mosaiks.',
    ],
    license: {
      label: 'MIT',
    },
    notes: [
      'Global estimates of United Nations Human Development Index (HDI) on a global 0.1 degree grid. Developed using a generalizable machine learning downscaling technique based on satellite imagery that allows for training and prediction with observations of arbitrary shape and size. This downscales the national HDI, which is a multi-dimensional index used for measuring national development, incorporating measures of income, education and health.',
    ],
  },
];
