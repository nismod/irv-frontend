import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const LAND_COVER_LAYER_METADATA = [
  {
    id: 'land_cover',
    title: 'Land Cover',
    description:
      'The source of these data are the ESA Climate Change Initiative and in particular its Land Cover project, ESA Climate Change Initiative Land Cover led by UCLouvain (2017), ESA Climate Change Initiative - Land Cover project 2020, and EC C3S Land Cover.',
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'European Space Agency Climate Change Initiative' },
    contact_point: { name: 'ESA Climate Change Initiative Land Cover project' },
    creator: { name: 'ESA Climate Change Initiative Land Cover project' },
    license: 'https://cds.climate.copernicus.eu/licences/satellite-land-cover',
    resources: [
      {
        id: 'source_esa_cci_land_cover',
        title: 'ESA Land cover classification',
        description: '',
        access_url:
          'https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-land-cover?tab=overview',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_esa_cci_land_cover',
          name: 'European Space Agency Climate Change Initiative Land Cover project (2021) Land cover classification gridded maps from 1992 to present derived from satellite observations, v2.1.1. https://doi.org/10.24381/cds.006f2c9a.',
          url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-land-cover?tab=overview',
          type: 'dataset',
          risk_data_type: ['exposure'],
          license: 'https://cds.climate.copernicus.eu/licences/satellite-land-cover',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
