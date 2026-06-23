import { makeColor } from '@/lib/colors';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { AssetMetadata } from '../assets/metadata';
import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const HEALTHSITES_COLOR = makeColor('#72dfda');

export const HEALTHSITES_METADATA: AssetMetadata = {
  type: 'circle',
  label: 'Healthcare',
  color: HEALTHSITES_COLOR.css,
};

export const HEALTHCARE_LAYER_METADATA = [
  {
    id: 'healthsites',
    title: 'Health site locations',
    description: 'Health site locations as points/polygons.',
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'healthsites.io' },
    contact_point: { name: 'healthsites.io' },
    creator: { name: 'healthsites.io' },
    license: 'https://opendatacommons.org/licenses/odbl/1-0/',
    resources: [
      {
        id: 'source_healthsites',
        title: 'healthsites.io',
        description: '',
        access_url: 'http://healthsites.io',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_healthsites_citation_1',
          name: 'This data was generated as an extract from the OpenStreetMap global open database (http://openstreetmap.org) by the Healthsites.io (http://healthsites.io) project. Data: Open Database License http://opendatacommons.org/licenses/odbl/. Data credits: OpenStreetMap contributors http://www.openstreetmap.org/copyright.',
          type: 'dataset',
          risk_data_type: ['exposure'],
          license: 'https://opendatacommons.org/licenses/odbl/1-0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
