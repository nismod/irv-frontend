import { d3 } from '@/lib/d3';
import { discardSides, invertColorScale } from '@/lib/data-map/color-maps';
import { ColorSpec } from '@/lib/data-map/view-layers';
import { makeColorConfig } from '@/lib/helpers';

export const NBS_ADAPTATION_COLORMAPS = {
  avoided_ead_mean: {
    scale: d3.scale.scaleSequential,
    scheme: discardSides(
      (n) => {
        return d3.scaleChromatic.interpolateMagma(1 - n);
      },
      0.2,
      0.2,
    ),
    range: [0, 1e6],
    empty: '#ccc',
  },
  adaptation_cost: {
    scale: d3.scale.scaleSequential,
    scheme: discardSides(d3.scaleChromatic.interpolateGreens, 0.2, 0.2),
    range: [0, 1e7],
    empty: '#ccc',
  },
  cost_benefit_ratio: {
    scale: d3.scale.scaleSequential,
    scheme: invertColorScale(d3.scaleChromatic.interpolateViridis),
    range: [1, 10],
    empty: '#ccc',
  },
} satisfies Record<string, ColorSpec>;

export const NBS_COLORS = makeColorConfig({
  crops: '#f4a582',
  other: '#92c5de',
  bare: '#eeeeee',
  accreting: '#25d582',
  retreating: '#ebca36',
  retreating_fast: '#a81a1a',
});
