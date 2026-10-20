import type { Texture } from '@luma.gl/core';
import { BitmapLayer, PickingInfo } from 'deck.gl';

import { ViewLayer } from '../view-layers';
import { RasterReadbackPool, type RasterReadbackBatch } from './raster-readback';
import { InteractionStyle, RasterTarget, VectorTarget } from './types';

/** Extended PickingInfo type for BitmapLayer */
type BitmapPickingInfo = PickingInfo & {
  bitmap?: {
    size: { width: number; height: number };
    uv: [number, number];
    pixel: [number, number];
  };
};

async function processRasterTarget(
  info: BitmapPickingInfo,
  readbackBatch?: RasterReadbackBatch,
): Promise<RasterTarget | null> {
  const { bitmap, sourceLayer } = info;
  if (bitmap) {
    const texture = (sourceLayer as BitmapLayer).props.image as Texture;
    const region = { x: bitmap.pixel[0], y: bitmap.pixel[1], width: 1, height: 1 };
    // Standalone callers own a temporary pool; hover supplies a shared batch.
    const pool = readbackBatch ? null : new RasterReadbackPool();
    const batch = readbackBatch ?? pool.createBatch();

    try {
      const pendingPixel = batch.readPixel(texture, region);
      if (pool) {
        batch.submit();
      }
      const pixelColor = await pendingPixel;

      return pixelColor[3]
        ? { color: Array.from(pixelColor.subarray(0, 4)) as [number, number, number, number] }
        : null;
    } finally {
      pool?.destroy();
    }
  }
  return null;
}

function processVectorTarget(info: PickingInfo): VectorTarget {
  const { object } = info;

  return object
    ? {
        feature: object,
      }
    : null;
}

const processingFunctionsByType = {
  raster: processRasterTarget,
  vector: processVectorTarget,
};

/**
 * Process raw deck.gl picking info and enrich with data about
 * view layer and interaction group
 */
export async function processPicked(
  info: PickingInfo,
  type: InteractionStyle,
  groupName: string,
  viewLayerLookup: Record<string, ViewLayer>,
  lookupViewForDeck: (deckLayerId: string) => string,
  readbackBatch?: RasterReadbackBatch,
) {
  const deckLayerId = info.layer.id;
  const viewLayerId = lookupViewForDeck(deckLayerId);
  const target = await processingFunctionsByType[type](info, readbackBatch);

  return (
    target && {
      interactionGroup: groupName,
      interactionStyle: type,
      viewLayer: viewLayerLookup[viewLayerId],
      deckLayerId,
      target,
    }
  );
}
