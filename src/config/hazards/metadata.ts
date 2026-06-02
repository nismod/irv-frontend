import { ReactNode } from 'react';

import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';
import { registerCategoricalColorScheme } from '@/lib/data-map/legend/use-raster-color-map-values';
import { FormatFunction, makeValueFormat } from '@/lib/formats';
import { makeOrderingCheck } from '@/lib/helpers';

import type { RdlsDataset, RdlsSource } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const HAZARD_TYPES = [
  'fluvial',
  'jrc_flood',
  // 'giri_flood',
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
  // 'giri_flood',
  'coastal',
]);

export const HAZARDS_UI_ORDER = hazardOrdering([
  'fluvial',
  'jrc_flood',
  // 'giri_flood',
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
  // giri_flood: 'fluvial/giri',
  coastal: 'coastal',
  cyclone: 'cyclone/storm',
  cyclone_iris: 'cyclone/iris',
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

// Cyclones

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

// River Flooding
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

// // GIRI
// registerHazardMetadata('giri_flood', {
//   label: 'River Flooding (GIRI)',
//   getFormatFn: () => riverFloodingFormat,
//   getColorMap: () => riverFloodingColorMap,
//   getPath: (hazardParams) => {
//     const { rp } = hazardParams;
//     return `giri_flood/${rp}`;
//   },
// });

// Coastal Flooding
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

// Extreme Heat
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

// Earthquake
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

// Drought
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

// Landslide
registerHazardMetadata('landslide', () => {
  const format = makeValueFormat('_', { maximumFractionDigits: 1, style: 'percent' });
  const colorMap: RasterColorMap = {
    type: 'continuous',
    scheme: 'greens',
    range: [0, 0.2],
    rangeTruncated: [false, true],
  };

  const LANDSLIDE_SUSCEPTIBILITY_VALUE_LABELS = {
    '1': 'Very Low',
    '2': 'Low',
    '3': 'Medium',
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

export const HAZARD_LAYER_METADATA = [
  {
    id: 'aqueduct__coastal',
    title: 'Coastal Flooding (Aqueduct)',
    description:
      'Inundation depth in metres for coastal floods over 1km grid squares. 1-in-2- to 1-in-1000-year return periods. Baseline, RCP 4.5 and 8.5 emission scenarios. Current and future maps in 2030, 2050 and 2080.',
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'World Resources Institute' },
    contact_point: { name: 'P.J. Ward' },
    creator: { name: 'P.J. Ward' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_aqueduct_floods',
        title: 'WRI Aqueduct Floods Hazard Maps',
        description: '',
        access_url: 'https://www.wri.org/data/aqueduct-floods-hazard-maps',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_aqueduct_floods',
          name: 'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020). Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute. https://www.wri.org/publication/aqueduct-floods-methodology',
          url: 'https://www.wri.org/publication/aqueduct-floods-methodology',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'aqueduct__fluvial',
    title: 'River Flooding (Aqueduct)',
    description:
      'Inundation depth in metres for riverine floods over 1km grid squares. 1-in-2- to 1-in-1000-year return periods. Baseline, RCP 4.5 and 8.5 emission scenarios. Current and future maps in 2030, 2050 and 2080.',
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'World Resources Institute' },
    contact_point: { name: 'P.J. Ward' },
    creator: { name: 'P.J. Ward' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_aqueduct_floods',
        title: 'WRI Aqueduct Floods Hazard Maps',
        description: '',
        access_url: 'https://www.wri.org/data/aqueduct-floods-hazard-maps',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_aqueduct_floods',
          name: 'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020). Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute. https://www.wri.org/publication/aqueduct-floods-methodology',
          url: 'https://www.wri.org/publication/aqueduct-floods-methodology',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'jrc_flood',
    title: 'River Flooding (JRC)',
    description:
      'The global river flood hazard maps are a gridded data set representing inundation along the river network, for seven different flood return periods (from 1-in-10-years to 1-in-500-years). The input river flow data for the new maps are produced by means of the open-source hydrological model LISFLOOD, while inundation simulations are performed with the hydrodynamic model LISFLOOD-FP. The extent comprises the entire world with the exception of Greenland and Antarctica and small islands with river basins smaller than 500km2.',
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'European Commission Joint Research Centre' },
    contact_point: { name: 'Calum Baugh' },
    creator: { name: 'Calum Baugh' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_jrc_floods',
        title: 'JRC Global River Flood Hazard Maps',
        description: '',
        access_url: 'http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_jrc_floods',
          name: "Baugh, Calum; Colonese, Juan; D'Angelo, Claudia; Dottori, Francesco; Neal, Jeffrey; Prudhomme, Christel; Salamon, Peter (2024): Global river flood hazard maps. European Commission, Joint Research Centre (JRC) [Dataset] Available online at: http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif.",
          url: 'http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'isimip__extreme_heat__occurrence',
    title: 'Extreme Heat Occurrence (ISIMIP)',
    description: `Annual probability of extreme heat events on a 0.5 degree grid. 8 hydrological models forced by 4 GCMs under baseline, RCP 2.6 and 6.0 emission scenarios. Current and future maps in 2030, 2050 and 2080.

Maps show the annual probability of an "extreme heat event" in each grid cell. Extreme heat events are defined by Lange et al (2020) as occurring when two indicators both exceed a threshold: a relative indicator based on temperature (Russo et al 2015, 2017) and an absolute indicator based on temperature and relative humidity (Masterton & Richardson, 1979).`,
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'OPSIS, University of Oxford' },
    contact_point: { name: 'Tom Russell' },
    creator: { name: 'Tom Russell' },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    resources: [
      {
        id: 'source_isimip_extreme_heat',
        title: 'Lange et al 2020, ISIMIP',
        description: '',
        access_url: 'https://data.isimip.org/search/tree/ISIMIP2b/DerivedOutputData/lange2020/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_extreme_heat_drought',
          name: "Lange, S., Volkholz, J., Geiger, T., Zhao, F., Vega, I., Veldkamp, T., et al. (2020). Projecting exposure to extreme climate impact events across six event categories and three spatial scales. Earth's Future, 8, e2020EF001616. DOI https://doi.org/10.1029/2020EF001616",
          url: 'https://doi.org/10.1029/2020EF001616',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_extreme_heat_drought',
          name: 'Russell, T., Nicholas, C., & Bernhofen, M. (2023) Annual probability of extreme heat and drought events, derived from Lange et al. climate impact event projections. https://doi.org/10.5281/zenodo.7732392',
          url: 'https://doi.org/10.5281/zenodo.7732392',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'isimip__drought__occurrence',
    title: 'Drought Occurrence (ISIMIP)',
    description: `Annual probability of drought events on a 0.5 degree grid. 8 hydrological models forced by 4 GCMs under baseline, RCP 2.6 and 6.0 emission scenarios. Current and future maps in 2030, 2050 and 2080.

Maps show annual probability of a "drought event", defined by Lange et al (2020) as monthly soil moisture falling below the 2.5th percentile of the preindustrial baseline distribution for at least seven consecutive months. Multiple impact models are available, currently showing "WaterGAP2"`,
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'OPSIS, University of Oxford' },
    contact_point: { name: 'Tom Russell' },
    creator: { name: 'Tom Russell' },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    resources: [
      {
        id: 'source_isimip_drought',
        title: 'Lange et al 2020, ISIMIP',
        description: '',
        access_url: 'https://data.isimip.org/search/tree/ISIMIP2b/DerivedOutputData/lange2020/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_extreme_heat_drought',
          name: "Lange, S., Volkholz, J., Geiger, T., Zhao, F., Vega, I., Veldkamp, T., et al. (2020). Projecting exposure to extreme climate impact events across six event categories and three spatial scales. Earth's Future, 8, e2020EF001616. DOI https://doi.org/10.1029/2020EF001616",
          url: 'https://doi.org/10.1029/2020EF001616',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_extreme_heat_drought',
          name: 'Russell, T., Nicholas, C., & Bernhofen, M. (2023) Annual probability of extreme heat and drought events, derived from Lange et al. climate impact event projections. https://doi.org/10.5281/zenodo.7732392',
          url: 'https://doi.org/10.5281/zenodo.7732392',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'cyclone_storm',
    title: 'Tropical Cyclones (STORM)',
    description:
      'Tropical cyclone maximum wind speed (in m/s) return period maps, generated using the STORM climate change datasets. 1-in-10- to 1-in-10,000-year return periods at 10 km resolution. Baseline and RCP 8.5 climate scenarios. Current and future (2050) epochs.',
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: '4TU.ResearchData' },
    contact_point: { name: 'Nadia Bloemendaal' },
    creator: { name: 'Nadia Bloemendaal' },
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    resources: [
      {
        id: 'source_storm_cyclone',
        title: 'STORM Tropical Cyclone Maximum Windspeeds, Present and Future climate',
        description: '',
        access_url:
          'https://data.4tu.nl/articles/dataset/STORM_tropical_cyclone_wind_speed_return_periods/12705164/3',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_storm_cyclone',
          name: 'Bloemendaal, Nadia; de Moel, H. (Hans); Muis, S; Haigh, I.D. (Ivan); Aerts, J.C.J.H. (Jeroen) (2020): STORM tropical cyclone wind speed return periods. 4TU.ResearchData. Dataset. DOI https://doi.org/10.4121/12705164.v3',
          url: 'https://doi.org/10.4121/12705164.v4',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        {
          id: 'source_storm_cyclone_cc',
          name: 'Bloemendaal, Nadia; de Moel, Hans; Dullaart, Job; Haarsma, R.J. (Reindert); Haigh, I.D. (Ivan); Martinez, Andrew B.; et al. (2022): STORM climate change tropical cyclone wind speed return periods. 4TU.ResearchData. Dataset. DOI https://doi.org/10.4121/14510817.v4',
          url: 'https://doi.org/10.4121/14510817.v4',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        {
          id: 'source_storm_cyclone_agg',
          name: 'Russell, Tom. (2022). STORM tropical cyclone wind speed return periods as global GeoTIFFs (1.0.0) [Data set]. Zenodo. DOI https://doi.org/10.5281/zenodo.7438144',
          url: 'https://doi.org/10.5281/zenodo.7438144',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
      ],
    },
  },
  {
    id: 'cyclone_iris',
    title: 'Tropical Cyclones (IRIS)',
    description:
      'Tropical cyclone maximum wind speeds (in m/s) generated using the IRIS tropical cyclone model. Wind speeds available from 1 in 10 to 1 in 1,000 year return periods at 1/10 degree spatial resolution. Present (2020) and future (2050) epochs, with SSP1-2.6, SSP2-4.5 and SSP5-8.5 future scenarios. Return period maps generated from an earlier version of the IRIS model event set.',
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Imperial College London' },
    contact_point: { name: 'N. Sparks' },
    creator: { name: 'N. Sparks' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_cyclone_iris',
        title: 'IRIS tropical cyclone model',
        description: '',
        access_url:
          'https://www.imperial.ac.uk/grantham/research/climate-science/modelling-tropical-cyclones/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_cyclone_iris',
          name: 'Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset. Scientific Data 11, 424 DOI 10.1038/s41597-024-03250-y',
          url: 'https://doi.org/10.1038/s41597-024-03250-y',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_cyclone_iris_dataset',
          name: 'Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model. Figshare. Collection. DOI https://doi.org/10.6084/m9.figshare.c.6724251.v1',
          url: 'https://doi.org/10.1038/s41597-024-03250-y',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_cyclone_iris_osc',
          name: "Sparks, N., Toumi, R. (2024). 'IRIS v1 historical and future hazard maps' in OS-Climate Physrisk. https://registry.opendata.aws/os-climate-physrisk/",
          url: 's3://os-climate-physical-risk/hazard-indicators/hazard.zarr/wind/iris/v1',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'earthquake',
    title: 'Earthquakes (GEM)',
    description:
      'The Global Earthquake Model (GEM) Global Seismic Hazard Map (version 2023.1) depicts the geographic distribution of the Peak Ground Acceleration (PGA) with a 10% probability of being exceeded in 50 years, computed for reference rock conditions (shear wave velocity, VS30, of 760-800 m/s).',
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Global Earthquake Model' },
    contact_point: { name: 'M. Pagani' },
    creator: { name: 'M. Pagani' },
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    resources: [
      {
        id: 'source_gem_earthquake',
        title: 'GEM Global Earthquake Hazard Map',
        description: '',
        access_url: 'https://www.globalquakemodel.org/gem-maps/global-earthquake-hazard-map',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_gem_earthquake',
          name: 'Pagani M, Garcia-Pelaez J, Gee R, Johnson K, Silva V, Simionato M, Styron R, Vigano D, Danciu L, Monelli D, Poggi V, Weatherill G. (2019). The 2018 version of the Global Earthquake Model: Hazard component. Earthquake Spectra, 36(1), DOI: https://doi.org/10.1177/8755293020931866',
          url: 'https://doi.org/10.1177/8755293020931866',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
        {
          id: 'source_gem_earthquake_data',
          name: 'Johnson, K., Villani, M., Bayliss, K., Brooks, C., Chandrasekhar, S., Chartier, T., Chen, Y.-S., Garcia-Pelaez, J., Gee, R., Styron, R., Rood, A., Simionato, M., & Pagani, M. (2023). Global Seismic Hazard Map (v2023.1.0) [Data set]. Zenodo. DOI https://doi.org/10.5281/zenodo.8409647',
          url: 'https://doi.org/10.5281/zenodo.8409647',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        },
      ],
    },
  },
  {
    id: 'landslide',
    title: 'Landslide (World Bank/Arup)',
    description: `The Global Landslide hazard map is a gridded dataset of landslide hazard produced at the global scale. The dataset comprises gridded maps of estimated annual frequency of significant landslides per square kilometre. Significant landslides are those which are likely to have been reported had they occurred in a populated place; limited information on reported landslide size makes it difficult to tie frequencies to size ranges but broadly speaking would be at least greater than 100 m2. The data provides frequency estimates for each grid cell on land between 60S and 72N for landslides triggered by seismicity and rainfall.

The dataset is publicly available for download and use and it consists of 4 global map layers:

Mean annual rainfall-triggered landslide hazard (1980—2018): raster values represent the modelled average annual frequency of significant rainfall-triggered landslides per sq. km.

Median annual rainfall-triggered landslide hazard (1980—2018): raster values represent the modelled median annual frequency of significant rainfall-triggered landslides per sq. km.

Mean annual earthquake-triggered landslide hazard: raster values represent the modelled average annual frequency of significant earthquake-triggered landslides per sq. km.

Aggregate hazard index ranging from 1 (low) to 4 (very high)
`,
    risk_data_type: ['hazard'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Arup' },
    contact_point: { name: 'Arup' },
    creator: { name: 'Arup' },
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    resources: [
      {
        id: 'source_global_landslide_hazard_map',
        title: 'Global Landslide Hazard Map',
        description: '',
        access_url:
          'https://datacatalog.worldbank.org/search/dataset/0037584/Global-landslide-hazard-map',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_global_landslide_hazard_map',
          name: 'Arup (2021) Global Landslide Hazard Map, prepared for The World Bank and Global Facility for Disaster Risk Reduction.',
          url: 'https://datacatalog.worldbank.org/search/dataset/0037584/Global-landslide-hazard-map',
          type: 'dataset',
          risk_data_type: ['hazard'],
          license: 'https://creativecommons.org/licenses/by-nc/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
