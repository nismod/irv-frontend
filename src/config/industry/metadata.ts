import { makeColorConfig, makeConfig } from '@/lib/helpers';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';
import { IndustryType } from '@/state/data-selection/industry';

import { AssetMetadata } from '../assets/metadata';
import {
  citationSources,
  GLOBAL_SPATIAL,
  SOURCE_DATASET_LINEAGE_DESCRIPTION,
} from '../layer-metadata-helpers';

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

export const INDUSTRY_LAYER_METADATA = [
  {
    id: 'cement-steel-assets',
    title: 'Cement and Steel Production Assets',
    description: 'Cement and Steel Asset site locations as points.',
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Spatial Finance Initiative' },
    contact_point: { name: 'M. McCarten' },
    creator: { name: 'M. McCarten' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_cement_steel_assets',
        title:
          'Global Databases of Cement and Iron and Steel Production Assets, Spatial Finance Initiative',
        description: '',
        access_url: 'https://www.cgfi.ac.uk/spatial-finance-initiative/database-downloads/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: citationSources(
        'source_cement_steel_assets_citation',
        [
          'McCarten, M., Bayaraa, M., Caldecott, B., Christiaen, C., Foster, P., Hickey, C., Kampmann, D., Layman, C., Rossi, C., Scott, K., Tang, K., Tkachenko, N., and Yoken, D. 2021. Global Database of Cement Production Assets. Spatial Finance Initiative.',
          'McCarten, M., Bayaraa, M., Caldecott, B., Christiaen, C., Foster, P., Hickey, C., Kampmann, D., Layman, C., Rossi, C., Scott, K., Tang, K., Tkachenko, N., and Yoken, D., 2021. Global Database of Iron and Steel Production Assets. Spatial Finance Initiative.',
        ],
        {
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ),
    },
  },
] as const satisfies readonly RdlsDataset[];
