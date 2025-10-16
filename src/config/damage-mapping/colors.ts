import { d3 } from '@/lib/d3';
import { invertColorScale } from '@/lib/data-map/color-maps';
import { ColorSpec } from '@/lib/data-map/view-layers';

export const DAMAGE_COLORMAP: ColorSpec = {
  scale: d3.scale.scaleSequential,
  scheme: invertColorScale(d3.scaleChromatic.interpolateInferno),
  range: [0, 1e5],
  empty: 'rgba(200,200,200,0.3)',
  zeroIsEmpty: true,
};
