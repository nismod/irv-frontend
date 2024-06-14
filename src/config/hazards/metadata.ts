import { ReactNode } from 'react';

import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';
import { makeValueFormat } from '@/lib/formats';
import { makeOrderingCheck } from '@/lib/helpers';

export const HAZARD_TYPES = [
  'fluvial',
  'coastal',
  'cyclone',
  'cyclone_iris',
  'extreme_heat',
  'earthquake',
  'drought',
] as const;

export type HazardType = (typeof HAZARD_TYPES)[number];

export const HAZARD_COLOR_MAPS: Record<HazardType, RasterColorMap> = {
  fluvial: {
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
    label: 'River Flooding',
    formatValue: makeValueFormat('_m', { maximumFractionDigits: 2 }),
    getPath: (hazardParams) => {
      const { rp, rcp, epoch, gcm } = hazardParams;
      return `aqueduct/fluvial/${rp}/${rcp}/${epoch}/${gcm}`;
    },
  },
  coastal: {
    label: 'Coastal Flooding',
    formatValue: makeValueFormat('_m', { maximumFractionDigits: 2 }),
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
};

const hazardOrdering = makeOrderingCheck<HazardType>();

export const HAZARDS_MAP_ORDER = hazardOrdering([
  'earthquake',
  'cyclone',
  'cyclone_iris',
  'drought',
  'extreme_heat',
  'fluvial',
  'coastal',
]);

export const HAZARDS_UI_ORDER = hazardOrdering([
  'fluvial',
  'coastal',
  'cyclone',
  'cyclone_iris',
  'drought',
  'extreme_heat',
  'earthquake',
]);
