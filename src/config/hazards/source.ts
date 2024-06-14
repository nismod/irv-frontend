import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';

import { SOURCES } from '../sources';
import { HAZARDS_METADATA, HazardType } from './metadata';

export interface HazardSourceParams {
  hazardType: HazardType;
  hazardParams: any;
  metric: 'occurrence' | 'exposure';
}

export function getHazardDataPath({ hazardType, hazardParams, metric }: HazardSourceParams) {
  return HAZARDS_METADATA[hazardType].getPath(hazardParams, metric);
}

export function getHazardDataUrl(params: HazardSourceParams, { scheme, range }: RasterColorMap) {
  const path = getHazardDataPath(params);

  return SOURCES.raster.getUrl({
    path,
    scheme,
    range,
  });
}
