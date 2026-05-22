import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const RWI_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'relative-wealth-index',
    section: 'vulnerability',
    dataset: 'Relative Wealth Index',
    source: {
      label: 'Meta Relative Wealth Index',
      url: 'https://dataforgood.facebook.com/dfg/tools/relative-wealth-index',
    },
    citation: [
      'Chi, G., et al. 2022. Microestimates of wealth for all low- and middle-income countries. Proceedings of the National Academy of Sciences Jan 2022, 119 (3) e2113658119; DOI: 10.1073/pnas.2113658119. Data available at: https://data.humdata.org/dataset/relative-wealth-index.',
    ],
    license: {
      label: 'CC-BY-NC 4.0',
    },
    notes: [
      'The Relative Wealth Index predicts the relative standard of living within countries using privacy protecting connectivity data, satellite imagery, and other novel data sources.',
    ],
  },
];
