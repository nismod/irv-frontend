import { ZRange } from '@deck.gl/geo-layers/typed/tileset-2d';
import { TileIndex } from '@deck.gl/geo-layers/typed/tileset-2d/types';
import { Matrix4 } from '@math.gl/core';
import { _Tileset2D, Viewport } from 'deck.gl/typed';
import _ from 'lodash';

/**
 * Simple extension of Tileset2D that returns tiles in a changed order:
 * the tiles closer to the middle of the viewport are returned first, so that the tile loading doesn't happen from the top-left corner of the map.
 * This assumes the base OSM indexing system.
 */
export class Tileset2DCentered extends _Tileset2D {
  getTileIndices(props: {
    viewport: Viewport;
    maxZoom?: number;
    minZoom?: number;
    zRange: ZRange;
    tileSize?: number;
    modelMatrix?: Matrix4;
    modelMatrixInverse?: Matrix4;
    zoomOffset?: number;
  }): TileIndex[] {
    const indices = super.getTileIndices(props);
    let minY = +Infinity,
      maxY = -Infinity,
      minX = +Infinity,
      maxX = -Infinity;

    for (const { x, y } of indices) {
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
      }
    }

    const midX = minX + (maxX + 1 - minX) / 2;
    const midY = minY + (maxY + 1 - minY) / 2;

    return _.sortBy(indices, ({ x, y }) =>
      Math.sqrt(Math.pow(x + 0.5 - midX, 2) + Math.pow(y + 0.5 - midY, 2)),
    );
  }
}
