import { DAMAGE_MAPPING_DATA_SOURCE_ROWS } from './damage-mapping/metadata';
import type { DataSourceSection, DataSourceTableRow } from './data-source-metadata-types';
import { HDI_GRID_DATA_SOURCE_ROWS } from './hdi-grid/metadata';
import { HEALTHCARE_DATA_SOURCE_ROWS } from './healthcare/metadata';
import { HUMAN_DEVELOPMENT_DATA_SOURCE_ROWS } from './human-development/metadata';
import { INDUSTRY_DATA_SOURCE_ROWS } from './industry/metadata';
import { NATURAL_ASSETS_DATA_SOURCE_ROWS } from './natural-assets/metadata';
import { NETWORK_DATA_SOURCE_ROWS } from './networks/metadata';
import { POPULATION_EXPOSURE_DATA_SOURCE_ROWS } from './population-exposure/metadata';
import { POWER_PLANTS_DATA_SOURCE_ROWS } from './power-plants/metadata';
import { PROTECTED_AREAS_DATA_SOURCE_ROWS } from './protected-areas/metadata';
import { RASTER_DATA_SOURCE_TABLE_ROWS } from './raster-metadata';
import { REGIONAL_RISK_DATA_SOURCE_ROWS } from './regional-risk/metadata';
import { RWI_DATA_SOURCE_ROWS } from './rwi/metadata';
import { TRAVEL_TIME_DATA_SOURCE_ROWS } from './travel-time/metadata';

function getDataSourceTableRow(
  rows: readonly DataSourceTableRow[],
  id: string,
): DataSourceTableRow {
  const row = rows.find((candidate) => candidate.id === id);
  if (!row) {
    throw new Error(`Missing data source row ${id}`);
  }
  return row;
}

const getRasterDataSourceRowsBySection = (section: DataSourceSection): DataSourceTableRow[] =>
  RASTER_DATA_SOURCE_TABLE_ROWS.filter((row) => row.section === section);

const getRasterDataSourceRow = (id: string): DataSourceTableRow =>
  getDataSourceTableRow(RASTER_DATA_SOURCE_TABLE_ROWS, id);

const getNaturalAssetsDataSourceRow = (id: string): DataSourceTableRow =>
  getDataSourceTableRow(NATURAL_ASSETS_DATA_SOURCE_ROWS, id);

export const DATA_SOURCE_TABLE_ROWS = [
  ...getRasterDataSourceRowsBySection('hazard'),
  ...NETWORK_DATA_SOURCE_ROWS,
  ...POWER_PLANTS_DATA_SOURCE_ROWS,
  getRasterDataSourceRow('ghsl-population-built-up'),
  ...HEALTHCARE_DATA_SOURCE_ROWS,
  ...INDUSTRY_DATA_SOURCE_ROWS,
  getRasterDataSourceRow('esa-cci-land-cover'),
  getRasterDataSourceRow('global-dem-derivatives-merit-dem'),
  getRasterDataSourceRow('soilgrids-organic-carbon'),
  ...TRAVEL_TIME_DATA_SOURCE_ROWS,
  ...HUMAN_DEVELOPMENT_DATA_SOURCE_ROWS,
  ...HDI_GRID_DATA_SOURCE_ROWS,
  ...RWI_DATA_SOURCE_ROWS,
  getNaturalAssetsDataSourceRow('biodiversity-intactness-index'),
  ...PROTECTED_AREAS_DATA_SOURCE_ROWS,
  getNaturalAssetsDataSourceRow('forest-landscape-integrity-index'),
  getRasterDataSourceRow('cooling-demand'),
  ...POPULATION_EXPOSURE_DATA_SOURCE_ROWS,
  ...DAMAGE_MAPPING_DATA_SOURCE_ROWS,
  ...REGIONAL_RISK_DATA_SOURCE_ROWS,
] as const satisfies readonly DataSourceTableRow[];

export function getDataSourceRows(section: DataSourceSection): readonly DataSourceTableRow[] {
  return DATA_SOURCE_TABLE_ROWS.filter((row) => row.section === section);
}
