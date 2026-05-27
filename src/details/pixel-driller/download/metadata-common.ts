import { DatapackageTableDialect, RdlsLocation } from './metadata-types';

/**
 * Common entities and helpers shared across all pixel-driller datasets.
 * These centralise values that are expected to be the same for all datasets.
 */
export const COMMON_DIALECT: DatapackageTableDialect = {
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
  centroid: [lng, lat],
});
