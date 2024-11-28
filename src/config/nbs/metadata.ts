import { ValueLabel } from '@/lib/controls/params/value-label';

export const ADAPTATION_VARIABLES = [
  'avoided_ead_mean',
  'adaptation_cost',
  'cost_benefit_ratio',
] as const;

export type AdaptationVariable = (typeof ADAPTATION_VARIABLES)[number];

export const ADAPTATION_VARIABLE_LABELS: ValueLabel<AdaptationVariable>[] = [
  {
    value: 'avoided_ead_mean',
    label: 'Avoided EAD (mean)',
  },
  {
    value: 'adaptation_cost',
    label: 'Adaptation cost',
  },
  {
    value: 'cost_benefit_ratio',
    label: 'Cost-benefit ratio',
  },
];

export const NBS_HAZARD_TYPES = ['ls_eq', 'ls_rf', 'ls_sum'] as const;

export type NbsHazardType = (typeof NBS_HAZARD_TYPES)[number];

export const NBS_HAZARD_LABELS: ValueLabel<NbsHazardType>[] = [
  { value: 'ls_eq', label: 'Landslides (earthquakes)' },
  { value: 'ls_rf', label: 'Landslides (rainfalls)' },
  { value: 'ls_sum', label: 'Landslides (combined)' },
];
