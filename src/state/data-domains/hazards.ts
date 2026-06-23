import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import _, { toNumber } from 'lodash';

import {
  DataParamGroupConfig,
  inferDependenciesFromData,
  inferDomainsFromData,
} from '@/lib/controls/data-params';

import { HAZARD_DOMAINS_CONFIG } from '@/config/hazards/domains';
import { HazardType } from '@/config/hazards/metadata';

import { rasterSourceDomainsQueryAtomFamily } from './sources';

const HAZARD_DOMAIN_PREPROCESSING = {
  rp: toNumber,
};

function numbersLast(value) {
  return isNaN(value) ? 0 : 1;
}
/**
 * Last-minute hack for sorting the epoch etc. labels correctly in the UI
 */
const HAZARD_DOMAIN_SORTING_FUNCTIONS = {
  epoch: [numbersLast, _.identity],
  rcp: [numbersLast, _.identity],
};

export const hazardDomainsConfigAtomFamily = atomFamily((hazardType: HazardType) =>
  atom(async (get): Promise<DataParamGroupConfig> => {
    const { defaults, dependencies, domain } = HAZARD_DOMAINS_CONFIG[hazardType];
    const preprocess = HAZARD_DOMAIN_PREPROCESSING;

    const paramNames = Object.keys(defaults);

    const sourceDomains = await get(rasterSourceDomainsQueryAtomFamily(domain));

    const uniqueDomains = _(sourceDomains)
      .map((x) => _.pick(x, paramNames))
      .uniqWith(_.isEqual)

      .map((obj) =>
        _.mapValues(obj, (value, key) => (preprocess[key] ? preprocess[key](value) : value)),
      )
      .value();

    const inferredDomains = inferDomainsFromData(uniqueDomains);
    // sortBy sorts integers correctly, whereas sort stringifies which results in 1, 10, 2, 20 etc
    const sortedDomains = _.mapValues(inferredDomains, (domain, domainName) =>
      _.sortBy(domain, HAZARD_DOMAIN_SORTING_FUNCTIONS[domainName]),
    );
    return {
      paramDomains: sortedDomains,
      paramDefaults: defaults,
      paramDependencies: inferDependenciesFromData(
        uniqueDomains,
        dependencies,
        HAZARD_DOMAIN_SORTING_FUNCTIONS,
      ),
    };
  }),
);
