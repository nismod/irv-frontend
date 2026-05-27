import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const POWER_PLANTS_LAYER_METADATA = [
  {
    id: 'wri-global-powerplants',
    title: 'Power plants',
    description:
      "The Global Power Plant Database is a comprehensive, open source database of power plants around the world. It centralizes power plant data to make it easier to navigate, compare and draw insights for one's own analysis. The database covers approximately 35,000 power plants from 167 countries and includes thermal plants (e.g. coal, gas, oil, nuclear, biomass, waste, geothermal) and renewables (e.g. hydro, wind, solar). Each power plant is geolocated and entries contain information on plant capacity, generation, ownership, and fuel type.",
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'World Resources Institute' },
    contact_point: { name: 'Global Energy Observatory' },
    creator: { name: 'Global Energy Observatory' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_wri_global_powerplants',
        title: 'WRI Global Powerplants Database',
        description: '',
        access_url: 'https://datasets.wri.org/dataset/globalpowerplantdatabase',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_wri_global_powerplants_citation_1',
          name: 'Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2018. Global Power Plant Database. Published on Resource Watch and Google Earth Engine; http://resourcewatch.org/ https://earthengine.google.com/.',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
