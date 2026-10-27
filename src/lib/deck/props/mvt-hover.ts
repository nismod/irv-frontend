import type { MVTLayerProps } from 'deck.gl';

import { tileSelectionLayer } from '@/lib/deck/layers/tile-selection-layer';

/** MVT props to draw a hovered feature and halo using the loaded tile geometry. */
export function mvtHover(hoveredFeatureId: string | number | null | undefined) {
  return {
    binary: false,
    autoHighlight: false,
    renderSubLayers: (tileProps) =>
      tileSelectionLayer(tileProps, {
        id: tileProps.id + '-hover',
        selectedFeatureId: hoveredFeatureId,
      }),
    updateTriggers: {
      renderSubLayers: ['mvtHover', hoveredFeatureId],
    },
  } satisfies Partial<MVTLayerProps>;
}
