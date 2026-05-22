import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const DAMAGE_MAPPING_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'infrastructure-risk',
    section: 'risk',
    dataset: 'Infrastructure Risk',
    source: {
      label: 'Derived from exposure and hazard layers',
    },
    citation: [
      'Russell T., Thomas F., nismod/open-gira contributors and OpenStreetMap contributors (2022) Global Infrastructure Damage Risk Estimates. [Dataset] Available at https://global.infrastructureresilience.org.',
    ],
    license: {
      label: 'CC-BY-SA, ODbL',
    },
    notes: [
      'Infrastructure expected annual direct damages are calculated from OpenStreetMap and Gridfinder networks, STORM cyclones and Aqueduct floods.',
    ],
  },
];
