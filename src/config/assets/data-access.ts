import { FieldSpec } from '@/lib/data-map/view-layers';
import { extraProperty, featureProperty } from '@/lib/deck/props/data-source';
import { withTriggers } from '@/lib/deck/props/getters';
import { sumOrNone } from '@/lib/helpers';

import { dataLoaderManager } from '@/data-loader-manager';

import { HAZARD_TYPES, HazardType } from '../hazards/metadata';

/* replace e.g. 4.5 with 4p5 */
function sanitiseRcp(rcp: string) {
  return rcp?.replace(/\./g, 'p');
}

/**
 * Construct the feature property name based on what data is requested
 * Handle various quirks in the data naming
 */
function getExpectedDamageKey(
  layer: string,
  direct: boolean,
  hazard: HazardType,
  rcp: string,
  epoch: string,
) {
  return `${direct ? 'ead' : 'eael'}__${hazard}__rcp_${sanitiseRcp(rcp)}__epoch_${epoch}`;
}

/**
 * Make a value accessor that sums up individual hazard damages on the fly into a total figure
 * NOTE: this isn't currently used in the G-SRAT version of the tool
 * The code here assumes damages for all hazards contribute to a total figure
 */
function totalExpectedDamagesProperty(layer: string, direct: boolean, { rcp, epoch }) {
  const hazardProperties = HAZARD_TYPES.map((ht) =>
    featureProperty(getExpectedDamageKey(layer, direct, ht, rcp, epoch)),
  );

  return withTriggers((f) => sumOrNone(hazardProperties.map((p) => p(f))), [direct, rcp, epoch]);
}

/**
 * Defines how to get data for an asset layer, depending on what field is required
 */
export function makeAssetDataAccessor(layer: string, fieldSpec: FieldSpec) {
  if (fieldSpec == null) return null;

  const { fieldGroup, fieldDimensions, field } = fieldSpec;

  if (fieldGroup === 'damages_expected') {
    /**
     * expected damages are stored in vector feature properties - need
     */
    const { hazard, rcp, epoch } = fieldDimensions;

    const isDirect = field.startsWith('ead_');

    /**
     * total hazard damages need to be calculated on the fly from the individual properties
     */
    if (hazard === 'all') {
      return totalExpectedDamagesProperty(layer, isDirect, fieldDimensions);
    }
    return featureProperty(getExpectedDamageKey(layer, isDirect, hazard, rcp, epoch));
  } else if (fieldGroup === 'damages_return_period') {
    /**
     * return period damages are loaded dynamically from the features API
     */
    return extraProperty(dataLoaderManager.getDataLoader(layer, fieldSpec));
  } else {
    /**
     * for any other fields, assume it's a property contained in the vector features
     */
    return featureProperty(field);
  }
}

export function makeAssetDataAccessorFactory(layer: string) {
  return (fieldSpec: FieldSpec) => makeAssetDataAccessor(layer, fieldSpec);
}
