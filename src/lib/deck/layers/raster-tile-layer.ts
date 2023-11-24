import type { TileLayerProps } from '@deck.gl/geo-layers/typed';
import type { BitmapBoundingBox, BitmapLayerProps } from '@deck.gl/layers/typed';

import { ConfigTree } from '@/lib/nested-config/config-tree';

import { bitmapLayer, tileLayer } from './base';
import { Tileset2DCentered } from './tileset-2d-centered';

function getBoundsForTile(tileProps): BitmapBoundingBox {
  const {
    bbox: { west, south, east, north },
  } = tileProps;

  return [west, south, east, north];
}

export function rasterTileLayer<DataT = any>(
  bitmapProps: Partial<BitmapLayerProps>,
  ...props: ConfigTree<Partial<TileLayerProps<DataT>>>
) {
  return tileLayer<DataT>(...props, {
    TilesetClass: Tileset2DCentered,
    renderSubLayers: (
      tileProps: any /** TODO: remove `any` when deck.gl type for `renderSubLayers` props has correct type for `data` prop */,
    ) => {
      return bitmapLayer(
        copyTilePropsWithoutData(tileProps),
        {
          image: tileProps.data,
          bounds: getBoundsForTile(tileProps.tile),
        },
        bitmapProps,
      );
    },
  });
}

function copyTilePropsWithoutData(tileProps) {
  const tilePropsCopy = { ...tileProps };
  delete tilePropsCopy.data;

  return tilePropsCopy;
}
