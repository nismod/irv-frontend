import { PathStyleExtension, PathStyleExtensionProps } from '@deck.gl/extensions';
import { Feature, Polygon } from 'geojson';

import { geoJsonLayer } from './base';

export interface BoundingBoxLayerOptions {
  bboxGeom: Feature<Polygon>;
}

/**
 * A deck.gl layer factory to draw a bounding box
 */
export function boundingBoxLayer({ bboxGeom }: BoundingBoxLayerOptions, ...props) {
  return geoJsonLayer<PathStyleExtensionProps>(
    {
      data: bboxGeom,

      stroked: true,
      filled: false,
      getLineColor: [0, 255, 255],
      lineWidthMinPixels: 1,
      getLineWidth: 2,
      lineWidthUnits: 'pixels',

      getDashArray: [5, 2],
      dashJustified: true,
      dashGapPickable: true,
      extensions: [new PathStyleExtension({ dash: true })],
    },
    props,
  );
}
