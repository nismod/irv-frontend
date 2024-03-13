import { HazardType } from './metadata';

export interface HazardParams {
  returnPeriod: number;
  epoch: string;
  rcp: string;
  gcm: string;
}

interface HazardDomainConfig {
  defaults: Record<string, any>;
  dependencies: Record<string, string[]>;
}

export const HAZARD_DOMAINS_CONFIG: Record<HazardType, HazardDomainConfig> = {
  fluvial: {
    defaults: {
      rp: 100,
      rcp: 'baseline',
      epoch: 'baseline',
      gcm: 'MIROC-ESM-CHEM',
    },
    dependencies: {
      rcp: ['epoch'],
      gcm: ['epoch'],
    },
  },
  coastal: {
    defaults: {
      rp: 100,
      epoch: 'baseline',
      rcp: 'baseline',
      gcm: 'None',
    },
    dependencies: {
      rcp: ['epoch'],
    },
  },
  cyclone: {
    defaults: {
      rp: 10,
      gcm: 'constant',
      epoch: 'baseline',
      rcp: 'baseline',
    },
    dependencies: {
      gcm: ['epoch'],
      rcp: ['epoch'],
    },
  },
  cyclone_iris: {
    defaults: {
      rp: 10,
      epoch: 'baseline',
      ssp: 'constant',
    },
    dependencies: {
      ssp: ['epoch'],
    },
  },
  extreme_heat: {
    defaults: {
      epoch: 'baseline',
      rcp: 'baseline',
      gcm: 'gfdl-esm2m',
    },
    dependencies: {
      rcp: ['epoch'],
    },
  },
  earthquake: {
    defaults: {
      rp: 475,
      medium: 'soil',
    },
    dependencies: {},
  },
  drought: {
    defaults: {
      epoch: 'baseline',
      rcp: 'baseline',
      gcm: 'gfdl-esm2m',
    },
    dependencies: {
      rcp: ['epoch'],
      gcm: ['epoch'],
    },
  },
};
