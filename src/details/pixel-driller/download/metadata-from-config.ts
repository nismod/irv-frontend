import { getLayerMetadata } from '@/config/layer-metadata';

import type { ReadmeContents } from './download-context';
import { COMMON_DIALECT } from './metadata-common';
import type {
  DatapackageTableSchemaField,
  RdlsDataset,
  RdlsLocation,
  RdlsResource,
} from './metadata-types';

export function buildPixelDrillerMetadata(
  metadataId: string,
  spatial: RdlsLocation,
  columns: DatapackageTableSchemaField[],
): RdlsDataset {
  const metadata = structuredClone(getLayerMetadata(metadataId));

  // patch in description of spatial extract
  const lineage = {
    ...metadata.lineage,
    description: `Data extracted at a single point location. ${metadata.lineage.description}`,
  };

  // patch in list of single CSV resource
  const resources: RdlsResource[] = [
    {
      id: `${metadataId}.csv`,
      title: metadata.resources[0].title,
      description: metadata.resources[0].description,
      format: 'csv',
      schema: {
        fields: columns,
      },
      dialect: COMMON_DIALECT,
    },
  ];

  // patch in common metadata for spatial extract
  return {
    ...metadata,
    license: metadata.license,
    lineage,
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
