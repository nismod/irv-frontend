import { MultiPolygon, Polygon } from '@nismod/irv-autopkg-client';

/**
 * Geojson and metadata for national boundary
 */
export type NationalGeo = {
  boundary: MultiPolygon; // geojson
  envelope: Polygon; // geojson
  countryName: string;
  isoCode: string;
};
