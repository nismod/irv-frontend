import { FeatureOut } from '@nismod/irv-api-client';
import _ from 'lodash';
import { atom, selector, waitForAll } from 'recoil';

import { DataParamGroupConfig, ParamGroup } from '@/lib/controls/data-params';
import { cartesian } from '@/lib/helpers';
import { useSyncRecoilState } from '@/lib/recoil/sync-state';

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
  get: ({ get }) =>
    get(waitForAll(_.mapValues(HAZARD_DOMAINS_CONFIG, (cfg, hazard) => paramsConfigState(hazard)))),
});

export const DamagesSection = ({ fd }) => {
  useSyncRecoilState(featureState, fd);

  return (
    <>
      <ExpectedDamagesSection />
      <RPDamagesSection />
    </>
  );
};

export function processRcpIncoming(rcp) {
  if (rcp.match(/\dp\d/)) return rcp.replace('p', '.');

  return rcp;
}
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

  for (const [hazard, { paramDomains }] of Object.entries(allParamDomains)) {
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
