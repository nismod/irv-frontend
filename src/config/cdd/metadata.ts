import { ValueLabel } from '@/lib/controls/params/value-label';

export const METRIC_TYPES = ['absolute', 'relative'] as const;

export type CDDType = (typeof METRIC_TYPES)[number];

export const METRIC_VALUE_LABELS: ValueLabel<CDDType>[] = [
  {
    value: 'absolute',
    label: 'Mean absolute Change (days per year)',
  },
  {
    value: 'relative',
    label: 'Relative Change',
  },
];
