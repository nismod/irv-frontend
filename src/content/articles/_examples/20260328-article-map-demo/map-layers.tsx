import { InteractionGroupConfig } from '@/lib/data-map/interactions/types';
import { StyleParams, ViewLayer } from '@/lib/data-map/view-layers';

import { DAMAGE_COLORMAP } from '@/config/damage-mapping/colors';
import { HAZARD_DOMAINS_CONFIG } from '@/config/hazards/domains';
import { hazardViewLayer } from '@/config/hazards/hazard-view-layer';
import { INTERACTION_GROUPS } from '@/config/interaction-groups';
import { infrastructureViewLayer } from '@/config/networks/infrastructure-view-layer';

/**
 * Order: infrastructure (`assets`), rasters (`hazards`).
 */
export const demoArticleInteractionGroups: InteractionGroupConfig[] = [
  INTERACTION_GROUPS.assets,
  INTERACTION_GROUPS.hazards,
];

function damageStyleForHazard(hazard: 'fluvial' | 'coastal'): StyleParams {
  return {
    colorMap: {
      colorSpec: DAMAGE_COLORMAP,
      fieldSpec: {
        fieldGroup: 'damages_expected',
        fieldDimensions: {
          hazard,
          rcp: 'baseline',
          epoch: 'baseline',
          protection_standard: 0,
        },
        field: 'ead_mean',
      },
    },
  };
}

/** Primary roads coloured by EAD for the given hazard — same pattern as Risk → Infrastructure. */
function roadsDamageLayer(hazard: 'fluvial' | 'coastal') {
  return infrastructureViewLayer('road_edges_primary', damageStyleForHazard(hazard));
}

const aqueductFluvialLayer = hazardViewLayer('fluvial', HAZARD_DOMAINS_CONFIG.fluvial.defaults);
const aqueductCoastalLayer = hazardViewLayer('coastal', HAZARD_DOMAINS_CONFIG.coastal.defaults);

/**
 * Aqueduct fluvial raster and primary roads with fluvial EAD colouring.
 */
export const demoArticleMapViewLayersFluvial: ViewLayer[] = [
  aqueductFluvialLayer,
  roadsDamageLayer('fluvial'),
];

/**
 * Aqueduct coastal raster and primary roads with coastal EAD colouring.
 */
export const demoArticleMapViewLayersCoastal: ViewLayer[] = [
  aqueductCoastalLayer,
  roadsDamageLayer('coastal'),
];
