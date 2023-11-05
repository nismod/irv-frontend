import { dataLoaderLayer, DataLoaderOptions } from '../layers/data-loader-layer';

/**
 * Deck.gl props factory to run tiled data loader layer for every tile of a TileLayer
 *
 * **NOTE**: requires merge strategies for `renderSubLayers` and `updateTriggers.renderSubLayers`
 */
export function tiledDataLoading(dataLoaderOptions: DataLoaderOptions) {
  return {
    binary: false, // data loader layer needs access to individual features
    renderSubLayers: (tileProps) => dataLoaderLayer(tileProps, dataLoaderOptions),
    updateTriggers: {
      // trick: add `tiledDataLoading` string to update triggers so that the triggers change when mvtDataLoading is added / removed
      renderSubLayers: ['tiledDataLoading', dataLoaderOptions.dataLoader],
    },
  };
}
