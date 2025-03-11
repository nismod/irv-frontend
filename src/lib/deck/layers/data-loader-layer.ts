import { GeoJSONFeature } from 'maplibre-gl';

import { DataLoader } from '@/lib/data-loader/data-loader';

import { getFeatureId } from '../utils/get-feature-id';

export interface DataLoaderOptions {
  dataLoader: DataLoader;
}

/**
 * A deck.gl layer to load data through an external loader for all vector features in a tile
 */
export function dataLoaderLayer(tileProps, { dataLoader }: DataLoaderOptions) {
  const {
    tile: { content },
  } = tileProps;
  if (content && dataLoader) {
    const ids: number[] = content.map((f: GeoJSONFeature) => getFeatureId(f));

    dataLoader.loadDataForIds(ids);
  }

  return null;
}
