import { MultiPolygon } from '@nismod/irv-autopkg-client';

type GdlLevel = 'Subnat' | 'Total';

type RegionProperties = {
  gdlCode: string;
  isoCode: string;
  level: GdlLevel;
  regionName: string;
};

/**
 * Geojson for a region boundary
 */
export type RegionGeo = {
  geometry: MultiPolygon; // geojson
  properties: RegionProperties;
  type: string;
};
