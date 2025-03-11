import { Texture } from '@luma.gl/core';
import { BitmapLayer, PickingInfo } from 'deck.gl';

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
  const { bitmap, sourceLayer, layer } = info;
  if (bitmap) {
    const { device } = layer.context;
    // the current deck.gl docs suggest using the deprecated function - see https://github.com/visgl/deck.gl/issues/9493
    const pixelColor = device.readPixelsToArrayWebGL(
      (sourceLayer as BitmapLayer).props.image as Texture,
      {
        sourceX: bitmap.pixel[0],
        sourceY: bitmap.pixel[1],
        sourceWidth: 1,
        sourceHeight: 1,
      },
    );

    return pixelColor[3]
      ? {
          color: Array.from(pixelColor) as [number, number, number, number],
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
