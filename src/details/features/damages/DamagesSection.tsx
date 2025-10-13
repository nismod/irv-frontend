import { FeatureOut } from '@nismod/irv-api-client';
import _ from 'lodash';
import { atom, noWait, selector } from 'recoil';

import { DataParamGroupConfig, ParamGroup } from '@/lib/controls/data-params';
import { cartesian } from '@/lib/helpers';
import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';

import { HAZARD_DOMAINS_CONFIG } from '@/config/hazards/domains';
import { HazardType } from '@/config/hazards/metadata';
import { paramsConfigState } from '@/state/data-params';

import { ExpectedDamagesSection } from './ExpectedDamagesSection';
import { RPDamagesSection } from './RPDamagesSection';

export const featureState = atom<FeatureOut>({
  key: 'DamagesSection/featureState',
  default: null,
});

export const hazardDataParamsState = selector({
  key: 'DamagesSection/hazardDataParams',
  get: ({ get }) => {
    return _.mapValues(HAZARD_DOMAINS_CONFIG, (_, hazard) => {
      const c = get(noWait(paramsConfigState(hazard)));
      return c.state === 'hasValue' ? c.contents : undefined;
    });
  },
});

export const DamagesSection = ({ fd }: { fd: FeatureOut }) => {
  useSyncValueToRecoil(fd, featureState);

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
