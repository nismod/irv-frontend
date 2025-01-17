import bboxPolygon from '@turf/bbox-polygon';
import { atom, selector } from 'recoil';

import { BoundingBox, extendBbox } from '@/lib/bounding-box';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { boundingBoxLayer } from '@/lib/deck/layers/bounding-box-layer';

export interface FeatureWithBbox {
  bbox: BoundingBox;
  id: string | number;
}

export const boundedFeatureState = atom<FeatureWithBbox>({
  key: 'boundedFeatureBboxState',
  default: null,
});

/** Returns buffer in kilometers for the feature bounding box, based on current zoom level */
function calculateZoomBasedBuffer(zoom: number): number {
  return Math.max(0.5, 1000 / Math.pow(2, zoom));
}

export const featureBoundingBoxLayerState = selector<ViewLayer>({
  key: 'featureBoundingBoxLayerState',
  get: ({ get }) => {
    const { id, bbox } = get(boundedFeatureState) ?? {};

    if (!bbox) return null;

    return {
      id: `feature-bounding-box-${id}`,
      fn: ({ deckProps, zoom }) => {
        const zoomBasedPaddingKm = calculateZoomBasedBuffer(zoom);
        const geom = bboxPolygon(extendBbox(bbox, zoomBasedPaddingKm));
        return boundingBoxLayer({ bboxGeom: geom }, deckProps);
      },
    };
  },
});
