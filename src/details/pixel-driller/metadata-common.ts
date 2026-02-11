import { RdlsDialect, RdlsEntity, RdlsLocation } from './metadata-types';

/**
 * Common entities and helpers shared across all pixel-driller datasets.
 * These centralise values that are expected to be the same for all datasets.
 */

export const COMMON_PUBLISHER: RdlsEntity = {
  name: 'OPSIS, University of Oxford',
};

export const COMMON_CONTACT_POINT: RdlsEntity = {
  name: 'Tom Russell',
  email: 'tom.russell@ouce.ox.ac.uk',
};

export const COMMON_CREATOR: RdlsEntity = {
  name: 'OPSIS, University of Oxford',
  url: 'https://www.eci.ox.ac.uk/research/infrastructure-systems',
};

export const COMMON_DIALECT: RdlsDialect = {
  delimiter: ',',
  header: true,
  commentChar: '#',
  nullSequence: '',
};

/**
 * Build a simple point-location object from the clicked site coordinates.
 * The same location is re-used for all datasets in the metadata package.
 */
export const createSpatialPoint = (lat: number, lng: number): RdlsLocation => ({
  geometry: {
    type: 'Point',
    coordinates: [lng, lat],
  },
});
