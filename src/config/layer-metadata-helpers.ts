import type { RdlsLocation, RdlsSource } from '@/details/pixel-driller/download/metadata-types';

export const GLOBAL_SPATIAL: RdlsLocation = { scale: 'global' };

export const SOURCE_DATASET_LINEAGE_DESCRIPTION =
  'Source dataset used by the Global Resilience Index Risk Viewer.';

export const citationSources = (
  idPrefix: string,
  citations: readonly string[],
  sourceFields: Partial<Omit<RdlsSource, 'id' | 'name'>> = {},
): RdlsSource[] =>
  citations.map((citation, index) => ({
    id: `${idPrefix}_${index + 1}`,
    name: citation,
    ...sourceFields,
  }));
