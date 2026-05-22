import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const TRAVEL_TIME_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'travel-time-healthcare',
    section: 'vulnerability',
    dataset: 'Access to Healthcare',
    source: {
      label: 'Global maps of travel time to healthcare facilities',
      url: 'https://www.nature.com/articles/s41591-020-1059-1',
    },
    citation: [
      'Weiss, D.J., Nelson, A., Vargas-Ruiz, C.A. et al. Global maps of travel time to healthcare facilities. Nat Med 26, 1835-1838 (2020). DOI: 10.1038/s41591-020-1059-1.',
    ],
    license: {
      label: 'CC BY 4.0',
    },
    notes: ['Motorised/non-motorised travel time on 30arcsec grid.'],
  },
];
