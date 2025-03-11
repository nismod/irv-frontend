import { DataFilterExtension, DataFilterExtensionProps } from '@deck.gl/extensions';
import { LayerProps } from 'deck.gl';

/**
 * Filter features by ID (or unique ID property) using the GPU extension
 * @param featureId the feature ID to filter by
 * @param uniqueIdProperty the name of a unique ID property, if feature IDs are not present
 * @param invert [optional, default: false] if true, invert the filter (show all features except the one with the given ID)
 * @returns deck.gl layer props that configure feature filtering
 */
export function featureFilter(
  featureId: string | number,
  uniqueIdProperty?: string,
  invert: boolean = false,
): DataFilterExtensionProps & Pick<LayerProps, 'updateTriggers' | 'extensions'> {
  const filterFn = uniqueIdProperty
    ? (x) => (x.properties[uniqueIdProperty] === featureId ? 1 : 0)
    : (x) => (x.id === featureId ? 1 : 0);

  return {
    updateTriggers: {
      getFilterValue: [uniqueIdProperty, featureId],
      filterRange: [invert],
    },

    getFilterValue: filterFn,
    filterRange: invert ? [0, 0] : [1, 1],
    filterCategories: [], // unnecesary here, but required in the type - see https://github.com/visgl/deck.gl/issues/9494
    extensions: [new DataFilterExtension({ filterSize: 1 })],
  };
}
