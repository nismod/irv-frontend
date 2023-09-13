import { RasterColorMap } from '@/map/legend/RasterLegend';

import { SOURCES } from '../sources';

export interface HazardSourceParams {
  hazardType: string;
  hazardParams: any;
  metric: 'occurrence' | 'exposure';
}

export function getHazardDataPath({ hazardType, hazardParams, metric }: HazardSourceParams) {
  let path: string;
  // TODO: Gather required keys from API
  if (hazardType === 'earthquake') {
    const { rp, medium } = hazardParams;
    path = `earthquake/${rp}/${medium}`;
  } else if (hazardType === 'cyclone_iris') {
    const { rp, ssp, epoch } = hazardParams;
    path = `${hazardType}/${epoch}/${rp}/${ssp}`;
  } else {
    const { rp, rcp, epoch, gcm } = hazardParams;
    const sanitisedRcp = rcp?.replace('.', 'x');

    if (hazardType === 'cyclone') {
      path = `${hazardType}/${rp}/${gcm}`;
    } else if (['extreme_heat', 'drought'].includes(hazardType)) {
      path = `${hazardType}/${metric}/${sanitisedRcp}/${epoch}/${gcm}`;
    } else {
      path = `${hazardType}/${rp}/${sanitisedRcp}/${epoch}/${gcm}`;
    }
  }

  return path;
}

export function getHazardDataUrl(params: HazardSourceParams, { scheme, range }: RasterColorMap) {
  const path = getHazardDataPath(params);

  return SOURCES.raster.getUrl({
    path,
    scheme,
    range,
  });
}
