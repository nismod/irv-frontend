import Typography from '@mui/material/Typography';
import { GeoJsonLayer } from 'deck.gl';

import { InteractionGroupConfig, InteractionTarget } from '@/lib/data-map/interactions/types';
import { ViewLayer } from '@/lib/data-map/view-layers';

/** Interaction group id for the demo polygon; must match `interactionGroup` on the layer. */
export const CUSTOM_DEMO_POLYGON_GROUP_ID = 'article_demo';

/** Small polygon over the default narrative map viewport (near lat 20°, lon −40°). */
const DEMO_FEATURE = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { name: 'Demo' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-45, 15],
            [-35, 15],
            [-35, 25],
            [-45, 25],
            [-45, 15],
          ],
        ],
      },
    },
  ],
};

function customPolygonTooltip(hover: InteractionTarget) {
  const name = (hover.target as { feature?: { properties?: { name?: string } } })?.feature
    ?.properties?.name;
  return <Typography variant="body2">Hovered: {name ?? 'feature'}</Typography>;
}

/**
 * Single pickable GeoJSON polygon with a minimal tooltip — for article map examples.
 */
export const customDemoPolygonLayer: ViewLayer = {
  id: 'article_map_demo_polygon',
  interactionGroup: CUSTOM_DEMO_POLYGON_GROUP_ID,
  fn: ({ deckProps }) =>
    new GeoJsonLayer({
      ...deckProps,
      data: DEMO_FEATURE,
      getFillColor: [200, 80, 80, 140],
      getLineColor: [120, 0, 0, 255],
      lineWidthMinPixels: 2,
    }),
  renderTooltip: customPolygonTooltip,
};

export const customDemoPolygonInteractionGroups: InteractionGroupConfig[] = [
  { id: CUSTOM_DEMO_POLYGON_GROUP_ID, type: 'vector', pickingRadius: 8 },
];

export const customDemoPolygonViewLayers: ViewLayer[] = [customDemoPolygonLayer];
