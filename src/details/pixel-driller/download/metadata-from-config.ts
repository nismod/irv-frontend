import { getLayerMetadata } from '@/config/layer-metadata';

import type { ReadmeContents } from './download-context';
import type { RdlsDataset, RdlsLocation, RdlsResource } from './metadata-types';

interface BuildPixelDrillerMetadataArgs {
  spatial: RdlsLocation;
  resources: RdlsResource[];
}

export function buildPixelDrillerMetadata(
  metadataId: string,
  { spatial, resources }: BuildPixelDrillerMetadataArgs,
): RdlsDataset {
  const metadata = structuredClone(getLayerMetadata(metadataId));

  return {
    ...metadata,
    spatial,
    resources,
  };
}

export function getPixelDrillerReadmeContents(metadataId: string): ReadmeContents {
  const metadata = getLayerMetadata(metadataId);
  return {
    datasetDescription: metadata.title || metadata.description,
    datasetSources:
      metadata.lineage?.sources
        .map((source) => source.name)
        .filter((name): name is string => Boolean(name?.trim())) ?? [],
  };
}
