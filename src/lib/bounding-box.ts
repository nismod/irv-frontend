import { parseSync } from '@loaders.gl/core';
import { WKTLoader } from '@loaders.gl/wkt';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
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

export function appBoundingBoxToPolygon(boundingBox: BoundingBox) {
  return bboxPolygon(boundingBox);
}

/** Pad bounds by an approximate distance, using the midpoint latitude for longitude scaling. */
export function extendBbox(boundingBox: BoundingBox, kilometers: number): BoundingBox {
  const [minX, minY, maxX, maxY] = boundingBox;
  const midpointLatitude = ((minY + maxY) / 2) * (Math.PI / 180);
  const latitudePadding = (kilometers / 6371.0088) * (180 / Math.PI);
  const longitudePadding = Math.min(180, latitudePadding / Math.cos(midpointLatitude));

  return [
    Math.max(-180, minX - longitudePadding),
    Math.max(-90, minY - latitudePadding),
    Math.min(180, maxX + longitudePadding),
    Math.min(90, maxY + latitudePadding),
  ];
}

/** Parse a bounding box geometry expressed as a WKT string and convert it to a `BoundingBox` object */
export function bboxWktToAppBoundingBox(bboxWkt: string) {
  const bboxGeom = parseSync(bboxWkt, WKTLoader);
  return bbox(bboxGeom) as BoundingBox;
}
