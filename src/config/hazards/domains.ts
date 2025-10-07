import { HazardType } from './metadata';

interface HazardDomainConfig {
  defaults: Record<string, any>;
  dependencies: Record<string, string[]>;
  domain: string; // backend/raster_tile_source domain
}

export const HAZARD_DOMAINS_CONFIG: Record<HazardType, HazardDomainConfig> = {
  fluvial: {
    domain: 'aqueduct',
    defaults: {
      hazard: 'fluvial',
      rp: 100,
      rcp: 'baseline',
      epoch: 'baseline',
      gcm: 'WATCH',
    },
    dependencies: {
      rp: ['hazard'],
      rcp: ['epoch'],
      gcm: ['epoch', 'hazard'],
    },
  },
  jrc_flood: {
    domain: 'jrc_flood',
    defaults: {
      rp: 100,
    },
    dependencies: {},
  },
  // giri_flood: {
  //   domain: 'giri_flood',
  //   defaults: {
  //     rp: 100,
  //   },
  //   dependencies: {},
  // },
  coastal: {
    domain: 'aqueduct',
    defaults: {
      hazard: 'coastal',
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
    domain: 'cyclone_storm',
    defaults: {
      rp: 100,
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
    domain: 'cyclone_iris',
    defaults: {
      rp: 100,
      epoch: 2020,
      ssp: 'constant',
    },
    dependencies: {
      ssp: ['epoch'],
    },
  },
  extreme_heat: {
    domain: 'isimip',
    defaults: {
      epoch: 'baseline',
      rcp: 'baseline',
      gcm: 'gfdl-esm2m',
      impact_model: 'hwmid-humidex',
    },
    dependencies: {
      rcp: ['epoch'],
    },
  },
  landslide: {
    domain: 'landslide',
    defaults: {
      subtype: 'rainfall_mean',
    },
    dependencies: {},
  },
  earthquake: {
    domain: 'earthquake',
    defaults: {
      rp: 475,
      medium: 'soil',
    },
    dependencies: {},
  },
  drought: {
    domain: 'isimip',
    defaults: {
      epoch: 'baseline',
      rcp: 'baseline',
      gcm: 'gfdl-esm2m',
      impact_model: 'watergap2',
    },
    dependencies: {
      rcp: ['epoch'],
      gcm: ['epoch'],
    },
  },
};
