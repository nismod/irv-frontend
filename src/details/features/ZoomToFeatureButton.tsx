import ZoomIn from '@mui/icons-material/ZoomIn';
import IconButton from '@mui/material/IconButton';
import type { BBox, Geometry } from 'geojson';
import { useMemo } from 'react';

import {
  bboxWktToAppBoundingBox,
  extendBbox,
  geoJsonToAppBoundingBox,
  type BoundingBox,
} from '@/lib/bounding-box';

import { useMapFitBounds } from '@/map/use-map-fit-bounds';

export interface ZoomableFeature {
  geometry?: Geometry | null;
  bbox?: BBox;
  properties?: Record<string, any>;
}

function getFeatureBounds(feature: ZoomableFeature, bboxWkt?: string): BoundingBox | null {
  let bounds: BoundingBox;

  try {
    const fullBoundsWkt = bboxWkt ?? feature.properties?.bbox_wkt;
    if (fullBoundsWkt) {
      bounds = bboxWktToAppBoundingBox(fullBoundsWkt);
    } else if (feature.bbox?.length === 4) {
      bounds = [...feature.bbox];
    } else if (feature.geometry) {
      bounds = geoJsonToAppBoundingBox(feature.geometry);
    } else {
      return null;
    }
  } catch {
    return null;
  }

  return bounds.every(Number.isFinite) && bounds[0] <= bounds[2] && bounds[1] <= bounds[3]
    ? bounds
    : null;
}

export function ZoomToFeatureButton({
  feature,
  bboxWkt,
}: {
  feature: ZoomableFeature;
  bboxWkt?: string;
}) {
  const { setMapFitBounds } = useMapFitBounds();
  const bounds = useMemo(() => getFeatureBounds(feature, bboxWkt), [feature, bboxWkt]);

  return (
    <IconButton
      title="Zoom to feature"
      aria-label="Zoom to feature"
      disabled={!bounds}
      onClick={() => setMapFitBounds(extendBbox(bounds, 0.5))}
    >
      <ZoomIn />
    </IconButton>
  );
}
