import { getRasterDatasetMetadata, getRasterReadmeContents } from '@/config/raster-metadata';

import type { ReadmeContents } from './download-context';
import { COMMON_CONTACT_POINT, COMMON_CREATOR, COMMON_PUBLISHER } from './metadata-common';
import type { RdlsDataset, RdlsLocation, RdlsResource } from './metadata-types';

interface BuildPixelDrillerMetadataArgs {
  spatial: RdlsLocation;
  resources: RdlsResource[];
}

export function buildPixelDrillerMetadata(
  metadataId: string,
  { spatial, resources }: BuildPixelDrillerMetadataArgs,
): RdlsDataset {
  const metadata = getRasterDatasetMetadata(metadataId);

  return {
    id: metadata.id,
    title: metadata.title,
    description: metadata.description,
    risk_data_type: [...metadata.risk_data_type],
    spatial,
    resources,
    publisher: COMMON_PUBLISHER,
    license: metadata.license,
    contact_point: COMMON_CONTACT_POINT,
    creator: COMMON_CREATOR,
    lineage: {
      description: metadata.lineage.description,
      sources: metadata.lineage.sources.map((source) => ({ ...source })),
    },
  };
}

export function getPixelDrillerReadmeContents(metadataId: string): ReadmeContents {
  const readme = getRasterReadmeContents(metadataId);
  return {
    datasetDescription: readme.datasetDescription,
    datasetSources: [...readme.datasetSources],
  };
}
