import { ValueLabel } from '@/lib/controls/params/value-label';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';

export const BUILDING_DENSITY_TYPES = ['all', 'non_residential'] as const;

export type BuildingDensityType = (typeof BUILDING_DENSITY_TYPES)[number];

export const BUILDING_DENSITY_TYPE_LABELS: ValueLabel<BuildingDensityType>[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'non_residential',
    label: 'Non-residential',
  },
];

export const BUILDING_DENSITY_COLORMAPS: Record<BuildingDensityType, RasterContinuousColorMap> = {
  all: {
    type: 'continuous',
    scheme: 'orrd',
    range: [0, 500_000],
    rangeTruncated: [false, true],
  },
  non_residential: {
    type: 'continuous',
    scheme: 'purples',
    range: [0, 300_000],
    rangeTruncated: [false, false],
  },
};
