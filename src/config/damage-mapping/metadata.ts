import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const DAMAGE_MAPPING_LAYER_METADATA = [
  {
    id: 'infrastructure-risk',
    title: 'Infrastructure Risk',
    description:
      'Infrastructure expected annual direct damages are calculated from OpenStreetMap and Gridfinder networks, STORM cyclones and Aqueduct floods.',
    risk_data_type: ['loss'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'OPSIS, University of Oxford' },
    contact_point: { name: 'Tom Russell' },
    creator: { name: 'Tom Russell' },
    license: 'https://global.infrastructureresilience.org/terms-of-use',
    resources: [
      {
        id: 'source_infrastructure_risk',
        title: 'Derived from exposure and hazard layers',
        description: '',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_infrastructure_risk_citation_1',
          name: 'Russell T., Thomas F., nismod/open-gira contributors and OpenStreetMap contributors (2022) Global Infrastructure Damage Risk Estimates. [Dataset] Available at https://global.infrastructureresilience.org.',
          type: 'dataset',
          risk_data_type: 'loss',
          license: 'https://global.infrastructureresilience.org/terms-of-use',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
