import { BUILDING_DENSITY_RASTER_METADATA } from './building-density/metadata';
import { CDD_RASTER_METADATA } from './cdd/metadata';
import type { DataSourceSection, DataSourceTableRow } from './data-source-metadata-types';
import { HAZARD_RASTER_METADATA } from './hazards/metadata';
import { LAND_COVER_RASTER_METADATA } from './land-cover/metadata';
import { NATURAL_ASSETS_RASTER_METADATA } from './natural-assets/metadata';
import { POPULATION_RASTER_METADATA } from './population/metadata';
import type { RasterDatasetMetadata } from './raster-metadata-types';
import { TOPOGRAPHY_RASTER_METADATA } from './topography/metadata';

export const RASTER_DATASET_METADATA = [
  ...HAZARD_RASTER_METADATA,
  ...CDD_RASTER_METADATA,
  ...POPULATION_RASTER_METADATA,
  ...BUILDING_DENSITY_RASTER_METADATA,
  ...LAND_COVER_RASTER_METADATA,
  ...TOPOGRAPHY_RASTER_METADATA,
  ...NATURAL_ASSETS_RASTER_METADATA,
] as const satisfies readonly RasterDatasetMetadata[];

const rasterDatasetMetadataById = new Map(
  RASTER_DATASET_METADATA.map((metadata) => [metadata.id, metadata]),
);

export function getRasterDatasetMetadata(id: string): RasterDatasetMetadata {
  const metadata = rasterDatasetMetadataById.get(id);
  if (!metadata) {
    throw new Error(`Missing raster dataset metadata for ${id}`);
  }
  return metadata;
}

export function getRasterReadmeContents(id: string): RasterDatasetMetadata['readme'] {
  return getRasterDatasetMetadata(id).readme;
}

export const RASTER_DATA_SOURCE_TABLE_ROWS: readonly DataSourceTableRow[] =
  RASTER_DATASET_METADATA.flatMap((metadata) =>
    metadata.dataSourceTable ? [metadata.dataSourceTable] : [],
  );

export function getRasterDataSourceRows(section: DataSourceSection): readonly DataSourceTableRow[] {
  return RASTER_DATA_SOURCE_TABLE_ROWS.filter((row) => row.section === section);
}
