import type { RdlsDataset, RiskDataType } from '@/details/pixel-driller/download/metadata-types';

import { BUILDING_DENSITY_LAYER_METADATA } from './building-density/metadata';
import { CDD_LAYER_METADATA } from './cdd/metadata';
import { DAMAGE_MAPPING_LAYER_METADATA } from './damage-mapping/metadata';
import { HAZARD_LAYER_METADATA } from './hazards/metadata';
import { HDI_GRID_LAYER_METADATA } from './hdi-grid/metadata';
import { HEALTHCARE_LAYER_METADATA } from './healthcare/metadata';
import { HUMAN_DEVELOPMENT_LAYER_METADATA } from './human-development/metadata';
import { INDUSTRY_LAYER_METADATA } from './industry/metadata';
import { LAND_COVER_LAYER_METADATA } from './land-cover/metadata';
import { NATURAL_ASSETS_LAYER_METADATA } from './natural-assets/metadata';
import { NETWORK_LAYER_METADATA } from './networks/metadata';
import { POPULATION_EXPOSURE_LAYER_METADATA } from './population-exposure/metadata';
import { POPULATION_LAYER_METADATA } from './population/metadata';
import { POWER_PLANTS_LAYER_METADATA } from './power-plants/metadata';
import { PROTECTED_AREAS_LAYER_METADATA } from './protected-areas/metadata';
import { REGIONAL_RISK_LAYER_METADATA } from './regional-risk/metadata';
import { RWI_LAYER_METADATA } from './rwi/metadata';
import { TOPOGRAPHY_LAYER_METADATA } from './topography/metadata';
import { TRAVEL_TIME_LAYER_METADATA } from './travel-time/metadata';

export type LayerMetadataSection = 'hazard' | 'exposure' | 'vulnerability' | 'risk';

function getModuleLayerMetadata(datasets: readonly RdlsDataset[], id: string): RdlsDataset {
  const dataset = datasets.find((candidate) => candidate.id === id);
  if (!dataset) {
    throw new Error(`Missing layer metadata ${id}`);
  }
  return dataset;
}

const naturalAssetsLayerMetadata = (id: string) =>
  getModuleLayerMetadata(NATURAL_ASSETS_LAYER_METADATA, id);

export const LAYER_METADATA: readonly RdlsDataset[] = [
  ...HAZARD_LAYER_METADATA,
  ...NETWORK_LAYER_METADATA,
  ...POWER_PLANTS_LAYER_METADATA,
  ...POPULATION_LAYER_METADATA,
  ...BUILDING_DENSITY_LAYER_METADATA,
  ...HEALTHCARE_LAYER_METADATA,
  ...INDUSTRY_LAYER_METADATA,
  ...LAND_COVER_LAYER_METADATA,
  ...TOPOGRAPHY_LAYER_METADATA,
  naturalAssetsLayerMetadata('soil_organic_carbon'),
  ...TRAVEL_TIME_LAYER_METADATA,
  ...HUMAN_DEVELOPMENT_LAYER_METADATA,
  ...HDI_GRID_LAYER_METADATA,
  ...RWI_LAYER_METADATA,
  naturalAssetsLayerMetadata('biodiversity-intactness-index'),
  ...PROTECTED_AREAS_LAYER_METADATA,
  naturalAssetsLayerMetadata('forest-landscape-integrity-index'),
  ...CDD_LAYER_METADATA,
  ...POPULATION_EXPOSURE_LAYER_METADATA,
  ...DAMAGE_MAPPING_LAYER_METADATA,
  ...REGIONAL_RISK_LAYER_METADATA,
];

const layerMetadataById = new Map(LAYER_METADATA.map((metadata) => [metadata.id, metadata]));

export function getLayerMetadata(id: string): RdlsDataset {
  const metadata = layerMetadataById.get(id);
  if (!metadata) {
    throw new Error(`Missing layer metadata for ${id}`);
  }
  return metadata;
}

const sectionRiskDataType: Record<LayerMetadataSection, RiskDataType> = {
  hazard: 'hazard',
  exposure: 'exposure',
  vulnerability: 'vulnerability',
  risk: 'loss',
};

export function getLayerMetadataBySection(section: LayerMetadataSection): readonly RdlsDataset[] {
  const riskDataType = sectionRiskDataType[section];
  return LAYER_METADATA.filter((metadata) => metadata.risk_data_type.includes(riskDataType));
}
