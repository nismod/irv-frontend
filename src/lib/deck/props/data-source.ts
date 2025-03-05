import _ from 'lodash';
import { GeoJSONFeature } from 'maplibre-gl';

import { DataLoader } from '@/lib/data-loader/data-loader';

import { AccessorFunction, withLoaderTriggers, withTriggers } from './getters';

/**
 * Factory function to create a deck.gl-compatible accessor function that returns a feature property,
 * based on the field name or an accessor function.
 *
 * *NOTE*: this function is memoized, so that the same function is returned for the same field name / accessor
 */
export const featureProperty = _.memoize(
  (
    field: string | AccessorFunction<any, GeoJSONFeature>,
  ): AccessorFunction<any, GeoJSONFeature> => {
    return typeof field === 'string' ? withTriggers((f) => f.properties[field], [field]) : field;
  },
);

/**
 * Factory function to create a deck.gl-compatible accessor function that, for each feature, returns a data value from an external data loader
 */
export function extraProperty(dataLoader: DataLoader): AccessorFunction<any> {
  return withLoaderTriggers((f) => dataLoader.getData(f.id), dataLoader);
}
