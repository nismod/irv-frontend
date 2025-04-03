import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';

export function getTerracottaColorMapParams(colorMap: RasterColorMap): {
  scheme: string;
  range?: [number, number];
} {
  if (colorMap.type === 'categorical') {
    return {
      scheme: 'explicit',
      range: undefined,
    };
  }
  if (colorMap.type === 'continuous') {
    return {
      scheme: colorMap.scheme,
      range: colorMap.range,
    };
  }

  throw new Error('Invalid color map');
}
