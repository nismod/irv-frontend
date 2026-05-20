import { FeatureOut } from '@nismod/irv-api-client';
import { atom } from 'jotai';
import _ from 'lodash';

import { DataParamGroupConfig, ParamGroup } from '@/lib/controls/data-params';
import { cartesian } from '@/lib/helpers';
import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';

import { HAZARD_DOMAINS_CONFIG } from '@/config/hazards/domains';
import { HazardType } from '@/config/hazards/metadata';
import { paramsConfigLoadableAtomFamily } from '@/state/data-params';

import { ExpectedDamagesSection } from './ExpectedDamagesSection';
import { RPDamagesSection } from './RPDamagesSection';

const INITIAL_FEATURE: FeatureOut | null = null;
export const featureAtom = atom<FeatureOut | null>(INITIAL_FEATURE);

// Reads Jotai paramsConfig populated by sidebar useLoadParamsConfig (which also writes Recoil paramsState).
export const hazardDataParamsAtom = atom((get) => {
  return _.mapValues(HAZARD_DOMAINS_CONFIG, (_unused, hazard) => {
    const c = get(paramsConfigLoadableAtomFamily(hazard));
    return c.state === 'hasData' ? c.data : undefined;
  });
});

export const DamagesSection = ({ fd }: { fd: FeatureOut }) => {
  useSyncValueToAtom(fd, featureAtom);

  return (
    <>
      <ExpectedDamagesSection />
      <RPDamagesSection />
    </>
  );
};

export const QUIRKY_FIELDS_MAPPING = {
  hazard: (h: string) => (h === 'river' ? 'fluvial' : h),
  epoch: (e: string) => (e === '1980' ? 'baseline' : e),
  rcp: (r: string) => {
    if (r === 'historical') return 'baseline';
    if (r.startsWith('rcp')) return r.substring(3).replace('p', '.'); // rcp4p5 -> 4.5
    return r;
  },
};

export function orderDamages<K, T extends K>(
  damages: T[],
  ordering: K[],
  getKeyFn: (obj: K) => string,
) {
  const lookup = _.keyBy(damages, 'key');

  return ordering
    .map(getKeyFn)
    .map((key) => lookup[key])
    .filter(Boolean);
}

export function buildOrdering<PGT extends ParamGroup>(
  allParamDomains: Record<HazardType, DataParamGroupConfig<PGT>>,
  fields: (keyof PGT)[],
) {
  const ordering = [];
  if (!allParamDomains) {
    return ordering;
  }

  for (const [hazard, config] of Object.entries(allParamDomains)) {
    if (!config.paramDomains) {
      continue;
    }
    const paramDomains = config.paramDomains;
    if (fields.every((key) => paramDomains[key])) {
      const prod = cartesian(...fields.map((f) => paramDomains[f]));

      for (const p of prod) {
        const obj = _.fromPairs(_.zip(fields, p));
        ordering.push({
          hazard,
          ...obj,
        });
      }
    }
  }
  return ordering;
}
