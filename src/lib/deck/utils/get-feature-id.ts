import { GeoJSONFeature } from 'maplibre-gl';

export interface FeatureWithIdAndProperties {
  id?: number | string;
  properties?: { id?: number | string } & Record<string, unknown>;
}

/** Get feature ID either from feature.id, or from a unique ID property.
 * Handles a deck.gl quirk where the ID is moved inside properties object in some cases.
 * Handles string IDs by parsing them to numbers (returns undefined if parsing fails).
 */
export function getFeatureId(
  feature: FeatureWithIdAndProperties,
  uniqueIdProperty?: string,
): number | undefined {
  if (feature == null) {
    return undefined;
  }

  let id;
  if (uniqueIdProperty) {
    id = feature.properties?.[uniqueIdProperty];
  } else {
    // try properties.id because deck.gl seems to currently move the ID inside properties object in some cases
    id = feature.id ?? feature.properties?.id;
  }

  if (id == null) {
    return undefined;
  }

  if (typeof id === 'number') {
    return id;
  }

  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return undefined;
  }

  return parsedId;
}
