import { useMemo } from 'react';

import { ViewLayer } from '@/lib/data-map/view-layers';

/**
 * One legend group: the layer that owns the legend UI plus all layers merged under the same `legendKey`.
 */
export interface GroupedLegendLayers {
  main: ViewLayer;
  all: ViewLayer[];
}

export function buildLegendConfigMap(viewLayers: ViewLayer[]): Map<string, GroupedLegendLayers> {
  const legendConfigs = new Map<string, GroupedLegendLayers>();

  viewLayers.forEach((viewLayer) => {
    if (viewLayer.renderLegend) {
      const { id, legendKey = id } = viewLayer;

      if (!legendConfigs.has(legendKey)) {
        legendConfigs.set(legendKey, { main: viewLayer, all: [] });
      }

      legendConfigs.get(legendKey)!.all.push(viewLayer);
    }
  });

  return legendConfigs;
}

/**
 * Memoized legend grouping: `null` when there is nothing to render (no `renderLegend` on any layer).
 */
export function useLegendConfigMap(
  viewLayers: ViewLayer[],
): Map<string, GroupedLegendLayers> | null {
  return useMemo(() => {
    const m = buildLegendConfigMap(viewLayers);
    return m.size ? m : null;
  }, [viewLayers]);
}
