import { ReactNode } from 'react';

import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';
import { registerCategoricalColorScheme } from '@/lib/data-map/legend/use-raster-color-map-values';
import { FormatFunction, makeValueFormat } from '@/lib/formats';
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

const HAZARD_SIDEBAR_PATH_MAPPING: Record<HazardType, string> = {
  fluvial: 'fluvial/aqueduct',
  jrc_flood: 'fluvial/jrc',
  coastal: 'coastal',
  cyclone: 'cyclone',
  cyclone_iris: 'cyclone_iris',
  extreme_heat: 'extreme_heat',
  earthquake: 'earthquake',
  drought: 'drought',
  landslide: 'landslide',
};

/**
 * Get sidebar section path for the given hazard type.
 * The configuration in HAZARD_SIDEBAR_PATH_MAPPING needs to match the paths in the layer selection sidebar
 */
export function getHazardSidebarPath(hazardType: HazardType) {
  return `hazards/${HAZARD_SIDEBAR_PATH_MAPPING[hazardType]}`;
}

export interface HazardMetadata {
  label: string;
  getFormatFn: (hazardParams: any) => FormatFunction<number>;
  getColorMap: (hazardParams: any) => RasterColorMap;
  getPath: (hazardParams: any, metric?: 'occurrence' | 'exposure') => string;
  labelAbbreviations?: Record<string, string>;
  legendAnnotation?: string;
}

export const HAZARDS_METADATA: Record<HazardType, HazardMetadata> = {} as any;

/**
 * Helper function to register hazard metadata.
 * Allows splitting hazard definitions into multiple files or locations in one file.
 * @param hazardType hazard type key under which metadata will be registered
 * @param metadata metadata object, or function that returns metadata object
 */
function registerHazardMetadata(
  hazardType: HazardType,
  metadata: HazardMetadata | (() => HazardMetadata),
) {
  HAZARDS_METADATA[hazardType] = typeof metadata === 'function' ? metadata() : metadata;
}

// === Cyclones  ==============================================================

const cyclonesFormat = makeValueFormat('_m/s', { maximumFractionDigits: 1 });
const cyclonesColorMap: RasterColorMap = {
  type: 'continuous',
  scheme: 'reds',
  range: [0, 90],
};

// STORM
registerHazardMetadata('cyclone', {
  label: 'Cyclones (STORM)',
  getFormatFn: () => cyclonesFormat,
  getColorMap: () => cyclonesColorMap,
  getPath: (hazardParams) => {
    const { rp, rcp, epoch, gcm } = hazardParams;
    return `cyclone_storm/${rp}/${gcm}/${rcp}/${epoch}`;
  },
});

// IRIS
registerHazardMetadata('cyclone_iris', {
  label: 'Cyclones (IRIS)',
  getFormatFn: () => cyclonesFormat,
  getColorMap: () => cyclonesColorMap,
  getPath: (hazardParams) => {
    const { rp, ssp, epoch } = hazardParams;
    return `cyclone_iris/${epoch}/${rp}/${ssp}`;
  },
});

// === River Flooding =========================================================

const riverFloodingFormat = makeValueFormat('_m', { maximumFractionDigits: 1 });
const riverFloodingColorMap: RasterColorMap = {
  type: 'continuous',
  scheme: 'blues',
  range: [0, 5],
  rangeTruncated: [false, true],
};

// Aqueduct
registerHazardMetadata('fluvial', {
  label: 'River Flooding (Aqueduct)',
  getFormatFn: () => riverFloodingFormat,
  getColorMap: () => riverFloodingColorMap,
  getPath: (hazardParams) => {
    const { rp, rcp, epoch, gcm } = hazardParams;
    return `aqueduct/fluvial/${rp}/${rcp}/${epoch}/${gcm}`;
  },
});

// JRC
registerHazardMetadata('jrc_flood', {
  label: 'River Flooding (JRC)',
  getFormatFn: () => riverFloodingFormat,
  getColorMap: () => riverFloodingColorMap,
  getPath: (hazardParams) => {
    const { rp } = hazardParams;
    return `jrc_flood/${rp}`;
  },
});

// === Coastal Flooding ======================================================

registerHazardMetadata('coastal', () => {
  const format = makeValueFormat('_m', { maximumFractionDigits: 1 });
  const colorMap: RasterColorMap = {
    type: 'continuous',
    scheme: 'greens',
    range: [0, 5],
    rangeTruncated: [false, true],
  };

  return {
    label: 'Coastal Flooding',
    getFormatFn: () => format,
    getColorMap: () => colorMap,
    getPath: (hazardParams) => {
      const { rp, rcp, epoch, gcm } = hazardParams;
      return `aqueduct/coastal/${rp}/${rcp}/${epoch}/${gcm}`;
    },
  };
});

// === Extreme Heat ===========================================================

registerHazardMetadata('extreme_heat', () => {
  const format = makeValueFormat('_', { maximumFractionDigits: 1, style: 'percent' });
  const colorMap: RasterColorMap = {
    type: 'continuous',
    scheme: 'reds',
    range: [0, 1],
  };

  return {
    label: 'Extreme Heat',
    getFormatFn: () => format,
    legendAnnotation: 'Annual probability of extreme event',
    getColorMap: () => colorMap,
    getPath: (hazardParams, metric) => {
      const { rcp, epoch, gcm, impact_model } = hazardParams;
      return `isimip/extreme_heat/${metric}/${rcp}/${epoch}/${gcm}/${impact_model}`;
    },
  };
});

// === Earthquake =============================================================

registerHazardMetadata('earthquake', () => {
  const format = makeValueFormat('_g', { maximumFractionDigits: 3 });
  const colorMap: RasterColorMap = {
    type: 'continuous',
    scheme: 'reds',
    range: [0, 1.4],
    rangeTruncated: [false, true],
  };

  return {
    label: 'Seismic Hazard (PGA)',
    getFormatFn: () => format,
    getColorMap: () => colorMap,
    labelAbbreviations: {
      PGA: 'Peak Ground Acceleration',
    },
    getPath: (hazardParams) => {
      const { rp, medium } = hazardParams;
      return `earthquake/${rp}/${medium}`;
    },
  };
});

// === Drought ================================================================
registerHazardMetadata('drought', () => {
  const format = makeValueFormat('_', { maximumFractionDigits: 1, style: 'percent' });
  const colorMap: RasterColorMap = {
    type: 'continuous',
    scheme: 'oranges',
    range: [0, 1],
  };

  return {
    label: 'Droughts',
    getFormatFn: () => format,
    legendAnnotation: 'Annual probability of extreme event',
    getColorMap: () => colorMap,
    getPath: (hazardParams, metric) => {
      const { rcp, epoch, gcm, impact_model } = hazardParams;
      return `isimip/drought/${metric}/${rcp}/${epoch}/${gcm}/${impact_model}`;
    },
  };
});

// === Landslide ==============================================================
registerHazardMetadata('landslide', () => {
  const format = makeValueFormat('_', { maximumFractionDigits: 1, style: 'percent' });
  const colorMap: RasterColorMap = {
    type: 'continuous',
    scheme: 'greens',
    range: [0, 0.2],
    rangeTruncated: [false, true],
  };

  // TODO - actual labels
  const LANDSLIDE_SUSCEPTIBILITY_VALUE_LABELS = {
    '1': 'Very Low',
    '2': 'Low',
    '3': 'Moderate',
    '4': 'High',
  };

  return {
    label: 'Landslide',
    getFormatFn: ({ subtype }) => {
      if (subtype === 'susceptibility') {
        return (value) => LANDSLIDE_SUSCEPTIBILITY_VALUE_LABELS[value];
      }
      return format;
    },
    legendAnnotation: 'Annual probability of landslide',
    getColorMap: (hazardParams) =>
      hazardParams.subtype === 'susceptibility'
        ? {
            type: 'categorical',
            scheme: 'landslide_susceptibility',
          }
        : colorMap,
    getPath: (hazardParams) => {
      const { subtype } = hazardParams;
      return `landslide/${subtype}`;
    },
  };
});

// temporary solution until backend is updated - color format needs to be exactly rgb(r,g,b) (without spaces)
registerCategoricalColorScheme('landslide_susceptibility', [
  {
    value: '1',
    color: 'rgb(208,254,229)',
  },
  {
    value: '2',
    color: 'rgb(229,228,135)',
  },
  {
    value: '3',
    color: 'rgb(224,156,108)',
  },
  {
    value: '4',
    color: 'rgb(216,76,76)',
  },
]);
