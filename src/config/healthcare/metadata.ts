import { makeColor } from '@/lib/colors';

import { AssetMetadata } from '../assets/metadata';
import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const HEALTHSITES_COLOR = makeColor('#72dfda');

export const HEALTHSITES_METADATA: AssetMetadata = {
  type: 'circle',
  label: 'Healthcare',
  color: HEALTHSITES_COLOR.css,
};

export const HEALTHCARE_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'healthsites',
    section: 'exposure',
    dataset: 'Health site locations',
    source: {
      label: 'healthsites.io',
      url: 'http://healthsites.io',
    },
    citation: [
      'This data was generated as an extract from the OpenStreetMap global open database (http://openstreetmap.org) by the Healthsites.io (http://healthsites.io) project. Data: Open Database License http://opendatacommons.org/licenses/odbl/. Data credits: OpenStreetMap contributors http://www.openstreetmap.org/copyright.',
    ],
    license: {
      label: 'ODbL',
    },
    notes: ['Health site locations as points/polygons.'],
  },
];
