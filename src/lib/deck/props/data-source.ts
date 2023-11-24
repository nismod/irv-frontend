import _ from 'lodash';
import { MapboxGeoJSONFeature } from 'mapbox-gl';

import { DataLoader } from '@/lib/data-loader/data-loader';

import { AccessorFunction, withLoaderTriggers, withTriggers } from './getters';

export const featureProperty = _.memoize(
  (
    field: string | AccessorFunction<any, MapboxGeoJSONFeature>,
  ): AccessorFunction<any, MapboxGeoJSONFeature> => {
    return typeof field === 'string' ? withTriggers((f) => f.properties[field], [field]) : field;
  },
);

export function extraProperty(dataLoader: DataLoader): AccessorFunction<any> {
  return withLoaderTriggers((f) => dataLoader.getData(f.id), dataLoader);
}
