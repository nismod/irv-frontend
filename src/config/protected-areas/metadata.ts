import { ValueLabel } from '@/lib/controls/params/value-label';
import { makeColorConfig } from '@/lib/helpers';

import type { DataSourceMetadataModule } from '../data-source-metadata-types';

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

export const PROTECTED_AREAS_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'protected-areas',
    section: 'vulnerability',
    dataset: 'Protected Areas',
    source: {
      label: 'World Database of Protected Areas',
      url: 'https://www.protectedplanet.net/en/thematic-areas/wdpa?tab=WDPA',
    },
    citation: [
      'UNEP-WCMC and IUCN (2022), Protected Planet: The World Database on Protected Areas (WDPA) [On-line], [October 2022], Cambridge, UK: UNEP-WCMC and IUCN. Available online: https://www.protectedplanet.net.',
    ],
    license: {
      label: 'No Commercial Use, No Reposting and/or Redistribution without written consent',
    },
    notes: ['Protected area locations as points/polygons.'],
  },
];
