import { ReactNode } from 'react';

import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterLegend';
import { makeValueFormat } from '@/lib/formats';
import { makeOrderingCheck } from '@/lib/helpers';

export const HAZARD_TYPES = [
  'fluvial',
  'jrc_flood',
  'coastal',
  'cyclone',
  'cyclone_iris',
  'extreme_heat',
  'earthquake',
  'drought',
  'landslide',
] as const;

export type HazardType = (typeof HAZARD_TYPES)[number];

export const HAZARD_COLOR_MAPS: Record<HazardType, RasterContinuousColorMap> = {
  fluvial: {
    scheme: 'blues',
    range: [0, 5],
    rangeTruncated: [false, true],
  },
  jrc_flood: {
    scheme: 'blues',
    range: [0, 5],
    rangeTruncated: [false, true],
  },
  coastal: {
    scheme: 'greens',
    range: [0, 5],
    rangeTruncated: [false, true],
  },
  cyclone: {
    scheme: 'reds',
    range: [0, 90],
  },
  cyclone_iris: {
    scheme: 'reds',
    range: [0, 90],
  },
  extreme_heat: {
    scheme: 'reds',
    range: [0, 1],
  },
  earthquake: {
    scheme: 'reds',
    range: [0, 1.4],
    rangeTruncated: [false, true],
  },
  drought: {
    scheme: 'oranges',
    range: [0, 1],
  },
  landslide: {
    scheme: 'greens',
    range: [0, 0.2],
    rangeTruncated: [false, true],
  },
};

export interface HazardMetadata {
  label: string;
  formatValue: (x: number) => ReactNode | string;
  getPath: (hazardParams: any, metric?: 'occurrence' | 'exposure') => string;
  labelAbbreviations?: Record<string, string>;
  legendAnnotation?: string;
}

export const HAZARDS_METADATA: Record<HazardType, HazardMetadata> = {
  cyclone: {
    label: 'Cyclones (STORM)',
    formatValue: makeValueFormat('_m/s', { maximumFractionDigits: 1 }),
    getPath: (hazardParams) => {
      const { rp, rcp, epoch, gcm } = hazardParams;
      return `cyclone_storm/${rp}/${gcm}/${rcp}/${epoch}`;
    },
  },
  cyclone_iris: {
    label: 'Cyclones (IRIS)',
    formatValue: makeValueFormat('_m/s', { maximumFractionDigits: 1 }),
    getPath: (hazardParams) => {
      const { rp, ssp, epoch } = hazardParams;
      return `cyclone_iris/${epoch}/${rp}/${ssp}`;
    },
  },
  fluvial: {
    label: 'River Flooding (Aqueduct)',
    formatValue: makeValueFormat('_m', { maximumFractionDigits: 1 }),
    getPath: (hazardParams) => {
      const { rp, rcp, epoch, gcm } = hazardParams;
      return `aqueduct/fluvial/${rp}/${rcp}/${epoch}/${gcm}`;
    },
  },
  jrc_flood: {
    label: 'River Flooding (JRC)',
    formatValue: makeValueFormat('_m', { maximumFractionDigits: 1 }),
    getPath: (hazardParams) => {
      const { rp } = hazardParams;
      return `jrc_flood/${rp}`;
    },
  },
  coastal: {
    label: 'Coastal Flooding',
    formatValue: makeValueFormat('_m', { maximumFractionDigits: 1 }),
    getPath: (hazardParams) => {
      const { rp, rcp, epoch, gcm } = hazardParams;
      return `aqueduct/coastal/${rp}/${rcp}/${epoch}/${gcm}`;
    },
  },
  extreme_heat: {
    label: 'Extreme Heat',
    formatValue: makeValueFormat('_', { maximumFractionDigits: 1, style: 'percent' }),
    legendAnnotation: 'Annual probability of extreme event',
    getPath: (hazardParams, metric) => {
      const { rcp, epoch, gcm, impact_model } = hazardParams;
      return `isimip/extreme_heat/${metric}/${rcp}/${epoch}/${gcm}/${impact_model}`;
    },
  },
  earthquake: {
    label: 'Seismic Hazard (PGA)',
    formatValue: makeValueFormat('_g', { maximumFractionDigits: 3 }),
    labelAbbreviations: {
      PGA: 'Peak Ground Acceleration',
    },
    getPath: (hazardParams) => {
      const { rp, medium } = hazardParams;
      return `earthquake/${rp}/${medium}`;
    },
  },
  drought: {
    label: 'Droughts',
    formatValue: makeValueFormat('_', { maximumFractionDigits: 1, style: 'percent' }),
    legendAnnotation: 'Annual probability of extreme event',
    getPath: (hazardParams, metric) => {
      const { rcp, epoch, gcm, impact_model } = hazardParams;
      return `isimip/drought/${metric}/${rcp}/${epoch}/${gcm}/${impact_model}`;
    },
  },
  landslide: {
    label: 'Landslide',
    formatValue: makeValueFormat('_', { maximumFractionDigits: 2 }),
    legendAnnotation: 'Annual probability of landslide',
    getPath: (hazardParams) => {
      const { subtype } = hazardParams;
      return `landslide/${subtype}`;
    },
  },
};

const hazardOrdering = makeOrderingCheck<HazardType>();

export const HAZARDS_MAP_ORDER = hazardOrdering([
  'earthquake',
  'landslide',
  'cyclone',
  'cyclone_iris',
  'drought',
  'extreme_heat',
  'fluvial',
  'jrc_flood',
  'coastal',
]);

export const HAZARDS_UI_ORDER = hazardOrdering([
  'fluvial',
  'jrc_flood',
  'coastal',
  'cyclone',
  'cyclone_iris',
  'drought',
  'extreme_heat',
  'landslide',
  'earthquake',
]);
