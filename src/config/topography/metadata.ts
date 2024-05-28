import { ValueLabel } from '@/lib/controls/params/value-label';

export const DEM_RASTER_TYPES = ['elevation', 'slope'] as const;

export type TopographyType = (typeof DEM_RASTER_TYPES)[number];

export const DEM_RASTER_VALUE_LABELS: ValueLabel<TopographyType>[] = [
  {
    value: 'elevation',
    label: 'Elevation',
  },
  {
    value: 'slope',
    label: 'Slope',
  },
];
