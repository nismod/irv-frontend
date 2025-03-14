import { parseSync } from '@loaders.gl/core';
import { WKTLoader } from '@loaders.gl/wkt';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import buffer from '@turf/buffer';
import { GeoJSON } from 'geojson';

/**
 * 2D bbox format as defined in GeoJSON, turf etc:
 * [minX, minY, maxX, maxY]
 */
export type BoundingBox = [minX: number, minY: number, maxX: number, maxY: number];

/**
 * Nominatim search result bbox format:
 * [minY, maxY, minX, maxX]
 */
export type NominatimBoundingBox = [minY: number, maxY: number, minX: number, maxX: number];

/**
 * Deck.GL bbox format:
 * [[minX, minY], [maxX, maxY]]
 */
export type DeckBoundingBox = [[minX: number, minY: number], [maxX: number, maxY: number]];

export function appToDeckBoundingBox(appBoundingBox: BoundingBox): DeckBoundingBox {
  return [
    [appBoundingBox[0], appBoundingBox[1]],
    [appBoundingBox[2], appBoundingBox[3]],
  ];
}

export function nominatimToAppBoundingBox(nominatimBoundingBox: NominatimBoundingBox): BoundingBox {
  return [
    nominatimBoundingBox[2],
    nominatimBoundingBox[0],
    nominatimBoundingBox[3],
    nominatimBoundingBox[1],
  ];
}

export function geoJsonToAppBoundingBox(geoJson: GeoJSON): BoundingBox {
  return bbox(geoJson) as BoundingBox;
}

export function extendBbox(boundingBox: BoundingBox, kilometers: number): BoundingBox {
  return bbox(buffer(bboxPolygon(boundingBox), kilometers)) as BoundingBox;
}

/** Parse a bounding box geometry expressed as a WKT string and convert it to a `BoundingBox` object */
export function bboxWktToAppBoundingBox(bboxWkt: string) {
  const bboxGeom = parseSync(bboxWkt, WKTLoader);
  return bbox(bboxGeom) as BoundingBox;
}
