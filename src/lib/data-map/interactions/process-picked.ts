import { readPixelsToArray } from '@luma.gl/core';
import { BitmapLayer, PickingInfo } from 'deck.gl/typed';

import { ViewLayer } from '../view-layers';
import { InteractionStyle, RasterTarget, VectorTarget } from './types';

/** Extended PickingInfo type for BitmapLayer */
type BitmapPickingInfo = PickingInfo & {
  bitmap?: {
    size: { width: number; height: number };
    uv: [number, number];
    pixel: [number, number];
  };
};

function processRasterTarget(info: BitmapPickingInfo): RasterTarget {
  const { bitmap, sourceLayer } = info;
  if (bitmap) {
    const pixelColor = readPixelsToArray((sourceLayer as BitmapLayer).props.image, {
      sourceX: bitmap.pixel[0],
      sourceY: bitmap.pixel[1],
      sourceWidth: 1,
      sourceHeight: 1,
      sourceType: undefined,
    });

    return pixelColor[3]
      ? {
          color: pixelColor,
        }
      : null;
  }
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
export function processPicked(
  info: PickingInfo,
  type: InteractionStyle,
  groupName: string,
  viewLayerLookup: Record<string, ViewLayer>,
  lookupViewForDeck: (deckLayerId: string) => string,
) {
  const deckLayerId = info.layer.id;
  const viewLayerId = lookupViewForDeck(deckLayerId);
  const target = processingFunctionsByType[type](info);

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
