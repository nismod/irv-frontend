import { geoJsonLayer, mvtLayer } from './base';
import { dataLoaderLayer, DataLoaderOptions } from './data-loader-layer';
import { tileSelectionLayer, TileSelectionLayerOptions } from './tile-selection-layer';
import { Tileset2DCentered } from './tileset-2d-centered';

interface SelectableMvtLayerOptions {
  selectionOptions: TileSelectionLayerOptions;
  dataLoaderOptions?: DataLoaderOptions;
}

export function selectableMvtLayer(
  { selectionOptions, dataLoaderOptions }: SelectableMvtLayerOptions,
  ...props
) {
  return mvtLayer(
    {
      TilesetClass: Tileset2DCentered,
      binary: false,
      autoHighlight: true,
      highlightColor: [0, 255, 255, 255],
      refinementStrategy: 'best-available',
      renderSubLayers: (tileProps) => [
        geoJsonLayer(tileProps),
        tileSelectionLayer(tileProps, selectionOptions),
        dataLoaderOptions && dataLoaderLayer(tileProps, dataLoaderOptions),
      ],
      updateTriggers: {
        renderSubLayers: [selectionOptions.selectedFeatureId],
      },
    },
    props,
  );
}
