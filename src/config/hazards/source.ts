import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';

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

export function getHazardDataUrl(
  params: HazardSourceParams,
  { scheme, range }: RasterContinuousColorMap,
) {
  const path = getHazardDataPath(params);

  return SOURCES.raster.getUrl({
    path,
    scheme,
    range,
  });
}
