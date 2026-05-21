import bboxPolygon from '@turf/bbox-polygon';
import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { BoundingBox, extendBbox } from '@/lib/bounding-box';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { boundingBoxLayer } from '@/lib/deck/layers/bounding-box-layer';

export interface FeatureWithBbox {
  bbox: BoundingBox;
  id: string | number;
}

const INITIAL_BOUNDED_FEATURE: FeatureWithBbox | null = null;
export const boundedFeatureAtom = jotaiAtom(INITIAL_BOUNDED_FEATURE);

/** Returns buffer in kilometers for the feature bounding box, based on current zoom level */
function calculateZoomBasedBuffer(zoom: number): number {
  return Math.max(0.5, 1000 / Math.pow(2, zoom));
}

export const featureBoundingBoxLayerAtom = jotaiAtom((get): ViewLayer | null => {
  const { id, bbox } = get(boundedFeatureAtom) ?? {};

  if (!bbox) return null;

  return {
    id: `feature-bounding-box-${id}`,
    fn: ({ deckProps, zoom }) => {
      const zoomBasedPaddingKm = calculateZoomBasedBuffer(zoom);
      const geom = bboxPolygon(extendBbox(bbox, zoomBasedPaddingKm));
      return boundingBoxLayer({ bboxGeom: geom }, deckProps);
    },
  };
});

/**
 * Recoil↔Jotai migration: feature bbox layer is computed in Jotai (`featureBoundingBoxLayerAtom`).
 * `NbsViewLayersSync` writes into this replica atom so `viewLayersState` keeps its ordering.
 */
export const featureBoundingBoxLayerState = atom<ViewLayer | null>({
  key: 'featureBoundingBoxLayerState',
  default: null,
});
