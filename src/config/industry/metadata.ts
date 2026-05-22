import { makeColorConfig, makeConfig } from '@/lib/helpers';

import { IndustryType } from '@/state/data-selection/industry';

import { AssetMetadata } from '../assets/metadata';
import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const INDUSTRY_COLORS = makeColorConfig<IndustryType>({
  cement: '#e4cda9',
  steel: '#5b8cc3',
});

export const INDUSTRY_METADATA = makeConfig<AssetMetadata & { shortLabel: string }, IndustryType>([
  {
    id: 'cement',
    type: 'circle',
    label: 'Industry (Cement)',
    shortLabel: 'Cement',
    color: INDUSTRY_COLORS.cement.css,
  },
  {
    id: 'steel',
    type: 'circle',
    label: 'Industry (Steel)',
    shortLabel: 'Steel',
    color: INDUSTRY_COLORS.steel.css,
  },
]);

export const INDUSTRY_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'cement-steel-assets',
    section: 'exposure',
    dataset: 'Cement and Steel Production Assets',
    source: {
      label:
        'Global Databases of Cement and Iron and Steel Production Assets, Spatial Finance Initiative',
      url: 'https://www.cgfi.ac.uk/spatial-finance-initiative/database-downloads/',
    },
    citation: [
      'McCarten, M., Bayaraa, M., Caldecott, B., Christiaen, C., Foster, P., Hickey, C., Kampmann, D., Layman, C., Rossi, C., Scott, K., Tang, K., Tkachenko, N., and Yoken, D. 2021. Global Database of Cement Production Assets. Spatial Finance Initiative.',
      'McCarten, M., Bayaraa, M., Caldecott, B., Christiaen, C., Foster, P., Hickey, C., Kampmann, D., Layman, C., Rossi, C., Scott, K., Tang, K., Tkachenko, N., and Yoken, D., 2021. Global Database of Iron and Steel Production Assets. Spatial Finance Initiative.',
    ],
    license: {
      label: 'CC BY 4.0',
    },
    notes: ['Cement and Steel Asset site locations as points.'],
  },
];
