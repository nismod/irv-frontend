import { ValueLabel } from '@/lib/controls/params/value-label';
import { makeColorConfig } from '@/lib/helpers';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import {
  citationSources,
  GLOBAL_SPATIAL,
  SOURCE_DATASET_LINEAGE_DESCRIPTION,
} from '../layer-metadata-helpers';

export const PROTECTED_AREA_TYPES = ['land', 'marine'] as const;

export type ProtectedAreaType = (typeof PROTECTED_AREA_TYPES)[number];

export const PROTECTED_AREA_LABELS: ValueLabel<ProtectedAreaType>[] = [
  {
    value: 'land',
    label: 'Terrestrial and Inland Waters',
  },
  {
    value: 'marine',
    label: 'Marine',
  },
];

export const PROTECTED_AREA_COLORS = makeColorConfig<ProtectedAreaType>({
  marine: '#004DA8',
  land: '#38A800',
});

export const PROTECTED_AREAS_LAYER_METADATA = [
  {
    id: 'protected-areas',
    title: 'Protected Areas',
    description: 'Protected area locations as points/polygons.',
    risk_data_type: ['vulnerability'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'UNEP-WCMC and IUCN' },
    contact_point: { name: 'UNEP-WCMC and IUCN' },
    creator: { name: 'UNEP-WCMC and IUCN' },
    license: 'https://www.protectedplanet.net/en/legal',
    resources: [
      {
        id: 'source_protected_areas',
        title: 'World Database of Protected Areas',
        description: '',
        access_url: 'https://www.protectedplanet.net/en/thematic-areas/wdpa?tab=WDPA',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: citationSources(
        'source_protected_areas_citation',
        [
          'UNEP-WCMC and IUCN (2022), Protected Planet: The World Database on Protected Areas (WDPA) [On-line], [October 2022], Cambridge, UK: UNEP-WCMC and IUCN. Available online: https://www.protectedplanet.net.',
        ],
        {
          type: 'dataset',
          risk_data_type: 'vulnerability',
          license: 'https://www.protectedplanet.net/en/legal',
        },
      ),
    },
  },
] as const satisfies readonly RdlsDataset[];
