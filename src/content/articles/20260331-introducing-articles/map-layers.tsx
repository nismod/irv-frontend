import { InteractionGroupConfig } from '@/lib/data-map/interactions/types';
import { ViewLayer } from '@/lib/data-map/view-layers';

import { HAZARD_DOMAINS_CONFIG } from '@/config/hazards/domains';
import { hazardViewLayer } from '@/config/hazards/hazard-view-layer';
import { INTERACTION_GROUPS } from '@/config/interaction-groups';
import { infrastructureViewLayer } from '@/config/networks/infrastructure-view-layer';
import { jrcPopulationViewLayer } from '@/config/population/population-view-layer';

/**
 * Order: infrastructure (`assets`), rasters (`hazards`).
 */
export const introArticleInteractionGroups: InteractionGroupConfig[] = [
  INTERACTION_GROUPS.assets,
  INTERACTION_GROUPS.hazards,
];

export const introArticleInteractionGroupsPop: InteractionGroupConfig[] = [
  INTERACTION_GROUPS.raster_assets,
];

const jrcLayer = hazardViewLayer('jrc_flood', HAZARD_DOMAINS_CONFIG.jrc_flood.defaults);
const aqueductFluvialLayer = hazardViewLayer('fluvial', HAZARD_DOMAINS_CONFIG.fluvial.defaults);
const aqueductCoastalLayer = hazardViewLayer('coastal', HAZARD_DOMAINS_CONFIG.coastal.defaults);

const roadTrunkLayer = infrastructureViewLayer('road_edges_trunk', {});
const roadPrimaryLayer = infrastructureViewLayer('road_edges_primary', {});
const roadSecondaryLayer = infrastructureViewLayer('road_edges_secondary', {});
const roadTertiaryLayer = infrastructureViewLayer('road_edges_tertiary', {});

/**
 * JRC River Flooding
 */
export const introArticleMapViewLayersFluvial: ViewLayer[] = [
  aqueductFluvialLayer,
  jrcLayer,
  aqueductCoastalLayer,
];

export const introArticleMapViewLayersPopulation: ViewLayer[] = [jrcPopulationViewLayer()];

export const introArticleMapViewLayersOverlay: ViewLayer[] = [
  jrcLayer,
  roadTrunkLayer,
  roadPrimaryLayer,
  roadSecondaryLayer,
  roadTertiaryLayer,
];
