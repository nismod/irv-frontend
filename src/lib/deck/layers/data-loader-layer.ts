import { MapboxGeoJSONFeature } from 'mapbox-gl';

import { DataLoader } from '@/lib/data-loader/data-loader';

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
    const ids: number[] = content.map((f: MapboxGeoJSONFeature) => f.id);

    dataLoader.loadDataForIds(ids);
  }

  return null;
}
