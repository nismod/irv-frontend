import {
  d3Scale,
  d3ScaleChromatic,
  discardSides,
  invertColorScale,
} from '@/lib/data-map/color-maps';
import { ColorSpec } from '@/lib/data-map/view-layers';

export const NBS_ADAPTATION_COLORMAPS = {
  avoided_ead_mean: {
    scale: d3Scale.scaleSequential,
    scheme: discardSides(d3ScaleChromatic.interpolateBlues, 0.2, 0.2),
    range: [0, 1e5],
    empty: '#ccc',
  },
  adaptation_cost: {
    scale: d3Scale.scaleSequential,
    scheme: discardSides(d3ScaleChromatic.interpolateGreens, 0.2, 0.2),
    range: [0, 1e7],
    empty: '#ccc',
  },
  cost_benefit_ratio: {
    scale: d3Scale.scaleSequential,
    scheme: invertColorScale(d3ScaleChromatic.interpolateViridis),
    range: [1, 10],
    empty: '#ccc',
  },
} satisfies Record<string, ColorSpec>;
