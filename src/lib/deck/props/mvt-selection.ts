import { MVTLayerProps } from 'deck.gl';

import { tileSelectionLayer, TileSelectionLayerOptions } from '../layers/tile-selection-layer';

/**
 * Deck.gl props factory to display a vector selection outline
 *
 * **NOTE**: requires merge strategies for `renderSubLayers` and `updateTriggers.renderSubLayers`
 */
export function mvtSelection(selectionOptions: TileSelectionLayerOptions) {
  return {
    binary: false,
    renderSubLayers: (tileProps) => tileSelectionLayer(tileProps, selectionOptions),
    updateTriggers: {
      // trick: add `mvtSelection` string to update triggers so that the triggers change when mvtSelection is added / removed
      renderSubLayers: ['mvtSelection', selectionOptions.selectedFeatureId],
    },
  } satisfies Partial<MVTLayerProps>;
}
