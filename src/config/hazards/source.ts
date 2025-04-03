import { getTerracottaColorMapParams } from '@/lib/color-maps/raster/terracotta';
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

export function getHazardDataUrl(params: HazardSourceParams, colorMap: RasterColorMap) {
  const path = getHazardDataPath(params);

  const { scheme, range } = getTerracottaColorMapParams(colorMap);

  return SOURCES.raster.getUrl({
    path,
    scheme,
    range,
  });
}
