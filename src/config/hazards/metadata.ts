import { ReactNode } from 'react';

import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';
import { registerCategoricalColorScheme } from '@/lib/data-map/legend/use-raster-color-map-values';
import { FormatFunction, makeValueFormat } from '@/lib/formats';
import { makeOrderingCheck } from '@/lib/helpers';

import {
  POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
  type RasterMetadataModule,
} from '../raster-metadata-types';

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

const aqueductFloodsSource = {
  id: 'source_aqueduct_floods',
  name: 'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020). Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute.',
  url: 'https://www.wri.org/publication/aqueduct-floods-methodology',
  type: 'dataset',
  risk_data_type: 'hazard',
  license: 'CC-BY-4.0',
};

const extremeHeatDroughtSource = {
  id: 'source_extreme_heat_drought',
  name: "Russell, T., Nicholas, C., & Bernhofen, M. (2023), derived from Lange et al. (2020) climate impact event projections from Earth's Future.",
  url: 'https://doi.org/10.5281/zenodo.8147088',
  type: 'dataset',
  risk_data_type: 'hazard',
  license: 'CC-BY-4.0',
};

export const HAZARD_RASTER_METADATA: RasterMetadataModule = [
  {
    id: 'aqueduct__coastal',
    title: 'Aqueduct Coastal Flood Risk',
    description:
      'Coastal flood risk at this site as modelled by the Aqueduct project, including flood heights for multiple return periods and scenarios.',
    risk_data_type: ['hazard'],
    license: 'CC-BY 4.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [aqueductFloodsSource],
    },
    readme: {
      datasetDescription: 'coastal and river flooding (Ward et al 2020; Baugh et al 2024)',
      datasetSources: [
        'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020) Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute. Available online at: https://www.wri.org/publication/aqueduct-floods-methodology',
      ],
    },
    dataSourceTable: {
      id: 'aqueduct-floods',
      section: 'hazard',
      dataset: 'Coastal and River flooding',
      source: {
        label: 'WRI Aqueduct Floods Hazard Maps',
        url: 'https://www.wri.org/data/aqueduct-floods-hazard-maps',
      },
      citation: [
        'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. 2020. Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute. Available online at: https://www.wri.org/publication/aqueduct-floods-methodology.',
      ],
      license: {
        label: 'Creative Commons Attribution International 4.0 License',
        url: 'https://creativecommons.org/licenses/by/4.0/',
      },
      notes: [
        'Inundation depth in meters for coastal and riverine floods over 1km grid squares. 1 in 2 to 1 in 1000 year return periods. Baseline, RCP 4.5 and 8.5 emission scenarios. Current and future maps in 2030, 2050 and 2080.',
      ],
    },
  },
  {
    id: 'aqueduct__fluvial',
    title: 'Aqueduct River Flood Risk',
    description:
      'River flood risk at this site as modelled by the Aqueduct project, including flood heights for multiple return periods and scenarios.',
    risk_data_type: ['hazard'],
    license: 'CC-BY 4.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [aqueductFloodsSource],
    },
    readme: {
      datasetDescription: 'coastal and river flooding (Ward et al 2020; Baugh et al 2024)',
      datasetSources: [
        'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020) Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute. Available online at: https://www.wri.org/publication/aqueduct-floods-methodology',
      ],
    },
  },
  {
    id: 'jrc_flood',
    title: 'River Flooding (JRC)',
    description:
      'River flood height hazard at this site from JRC global river flood hazard maps, a gridded inundation dataset for seven flood return periods.',
    risk_data_type: ['hazard'],
    license: 'CC-BY 4.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_jrc_floods',
          name: "Baugh, Calum; Colonese, Juan; D'Angelo, Claudia; Dottori, Francesco; Neal, Jeffrey; Prudhomme, Christel; Salamon, Peter (2024): Global river flood hazard maps. European Commission, Joint Research Centre (JRC) [Dataset]. The dataset is created as part of the Copernicus Emergency Management Service.",
          url: 'http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif',
          type: 'dataset',
          risk_data_type: 'hazard',
          license: 'CC-BY-4.0',
        },
      ],
    },
    readme: {
      datasetDescription: 'coastal and river flooding (Ward et al 2020; Baugh et al 2024)',
      datasetSources: [
        "Baugh, Calum; Colonese, Juan; D'Angelo, Claudia; Dottori, Francesco; Neal, Jeffrey; Prudhomme, Christel; Salamon, Peter (2024): Global river flood hazard maps. European Commission, Joint Research Centre (JRC) [Dataset] PID: http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif",
      ],
    },
    dataSourceTable: {
      id: 'jrc-floods',
      section: 'hazard',
      dataset: 'River flooding',
      source: {
        label: 'JRC Global River Flood Hazard Maps',
        url: 'http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif',
      },
      citation: [
        "Baugh, Calum; Colonese, Juan; D'Angelo, Claudia; Dottori, Francesco; Neal, Jeffrey; Prudhomme, Christel; Salamon, Peter (2024): Global river flood hazard maps. European Commission, Joint Research Centre (JRC) [Dataset] Available online at: http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif.",
      ],
      license: {
        label: 'Creative Commons Attribution 4.0 International',
        url: 'http://creativecommons.org/licenses/by/4.0/legalcode',
      },
      notes: [
        'The global river flood hazard maps are a gridded data set representing inundation along the river network, for seven different flood return periods (from 1-in-10-years to 1-in-500-years). The input river flow data for the new maps are produced by means of the open-source hydrological model LISFLOOD, while inundation simulations are performed with the hydrodynamic model LISFLOOD-FP. The extent comprises the entire world with the exception of Greenland and Antarctica and small islands with river basins smaller than 500km2.',
        'Cell values indicate water depth (in m). The maps can be used to assess the exposure of population and economic assets to river floods, and to perform flood risk assessments. The dataset is created as part of the Copernicus Emergency Management Service. NOTE: this dataset is not an official flood hazard map; for details and limitations please refer to related publications.',
      ],
    },
  },
  {
    id: 'isimip__extreme_heat__occurrence',
    title: 'Extreme Heat Occurrence (ISIMIP)',
    description:
      'Annual probability of extreme heat events at this site from ISIMIP-derived climate impact projections across emissions scenarios, epochs, and climate models.',
    risk_data_type: ['hazard'],
    license: 'CC0 1.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [extremeHeatDroughtSource],
    },
    readme: {
      datasetDescription:
        'extreme heat and drought (Russell et al 2023, derived from Lange et al 2020)',
      datasetSources: [
        'Russell, T., Nicholas, C., & Bernhofen, M. (2023). Annual probability of extreme heat and drought events, derived from Lange et al 2020 (Version 2) [Dataset]. Zenodo. DOI: https://doi.org/10.5281/zenodo.8147088',
        "Lange, S., Volkholz, J., Geiger, T., Zhao, F., Vega, I., Veldkamp, T., et al. (2020). Projecting exposure to extreme climate impact events across six event categories and three spatial scales. Earth's Future, 8, e2020EF001616. DOI: https://doi.org/10.1029/2020EF001616",
      ],
    },
    dataSourceTable: {
      id: 'isimip-extreme-heat-drought',
      section: 'hazard',
      dataset: 'Extreme Heat and Drought',
      source: {
        label: 'Lange et al 2020, ISIMIP',
        url: 'https://data.isimip.org/search/tree/ISIMIP2b/DerivedOutputData/lange2020/',
      },
      citation: [
        "Lange, S., Volkholz, J., Geiger, T., Zhao, F., Vega, I., Veldkamp, T., et al. (2020). Projecting exposure to extreme climate impact events across six event categories and three spatial scales. Earth's Future, 8, e2020EF001616. DOI 10.1029/2020EF001616.",
      ],
      license: {
        label: 'CC0 1.0',
      },
      notes: [
        'Annual probability of drought (soil moisture below a baseline threshold) or extreme heat (temperature and humidity-based indicators over a threshold) events on a 0.5 degree grid. 8 hydrological models forced by 4 GCMs under baseline, RCP 2.6 and 6.0 emission scenarios. Current and future maps in 2030, 2050 and 2080.',
        'The ISIMIP2b climate input data and impact model output data analyzed in this study are available in the ISIMIP data repository at ESGF: https://esg.pik-potsdam.de/search/isimip/?project=ISIMIP2b&product=input and https://esg.pik-potsdam.de/search/isimip/?project=ISIMIP2b&product=output. More information about the GHM, GGCM, and GVM output data is provided by Gosling et al. (2020), Arneth et al. (2020), and Reyer et al. (2019).',
        'Event definitions are given in Lange et al, table 1. Land area is exposed to drought if monthly soil moisture falls below the 2.5th percentile of the preindustrial baseline distribution for at least seven consecutive months. Land area is exposed to extreme heat if both a relative indicator based on temperature (Russo et al 2015, 2017) and an absolute indicator based on temperature and relative humidity (Masterton & Richardson, 1979) exceed their respective threshold value.',
        'The time series of extreme events given by Lange et al has been processed into an annual probability of occurrence by the GRI team for visualisation purposes.',
      ],
    },
  },
  {
    id: 'isimip__drought__occurrence',
    title: 'Drought Occurrence (ISIMIP)',
    description:
      'Annual probability of drought occurrence at this site from ISIMIP-derived climate impact projections across emissions scenarios, epochs, and climate models.',
    risk_data_type: ['hazard'],
    license: 'CC0 1.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [extremeHeatDroughtSource],
    },
    readme: {
      datasetDescription:
        'extreme heat and drought (Russell et al 2023, derived from Lange et al 2020)',
      datasetSources: [
        'Russell, T., Nicholas, C., & Bernhofen, M. (2023). Annual probability of extreme heat and drought events, derived from Lange et al 2020 (Version 2) [Dataset]. Zenodo. DOI: https://doi.org/10.5281/zenodo.8147088',
        "Lange, S., Volkholz, J., Geiger, T., Zhao, F., Vega, I., Veldkamp, T., et al. (2020). Projecting exposure to extreme climate impact events across six event categories and three spatial scales. Earth's Future, 8, e2020EF001616. DOI: https://doi.org/10.1029/2020EF001616",
      ],
    },
  },
  {
    id: 'cyclone_storm',
    title: 'Tropical Cyclones (STORM)',
    description:
      'STORM tropical cyclone wind speed hazard at this site across multiple return periods, scenarios and climate models.',
    risk_data_type: ['hazard'],
    license: 'CC0 1.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_storm_cyclone',
          name: 'Bloemendaal, Nadia; de Moel, H. (Hans); Muis, S; Haigh, I.D. (Ivan); Aerts, J.C.J.H. (Jeroen) (2020): STORM tropical cyclone wind speed return periods. 4TU.ResearchData. Dataset. doi:10.4121/12705164.v3. Aggregated as Russell, Tom. (2022). STORM tropical cyclone wind speed return periods as global GeoTIFFs (1.0.0) [Data set]. Zenodo. doi:10.5281/zenodo.7438145.',
          url: 'https://doi.org/10.4121/12705164.v3',
          type: 'dataset',
          risk_data_type: 'hazard',
          license: 'CC-BY-4.0',
        },
        {
          id: 'source_storm_cyclone_cc',
          name: 'Bloemendaal, Nadia; de Moel, Hans; Dullaart, Job; Haarsma, R.J.; Haigh, I.D.; Martinez, Andrew B.; et al. (2022): STORM climate change tropical cyclone wind speed return periods. 4TU.ResearchData. Dataset. doi:10.4121/14510817.v3.',
          url: 'https://doi.org/10.4121/14510817.v3',
          type: 'dataset',
          risk_data_type: 'hazard',
          license: 'CC-BY-4.0',
        },
      ],
    },
    readme: {
      datasetDescription:
        'tropical cyclone wind speeds (Sparks and Toumi 2024; Russell 2022, derived from Bloemendaal et al 2020 and Bloemendaal et al 2022)',
      datasetSources: [
        'Bloemendaal, Nadia; de Moel, H. (Hans); Muis, S; Haigh, I.D. (Ivan); Aerts, J.C.J.H. (Jeroen) (2020): STORM tropical cyclone wind speed return periods. 4TU.ResearchData. [Dataset]. DOI: https://doi.org/10.4121/12705164.v3',
        'Bloemendaal, Nadia; de Moel, Hans; Dullaart, Job; Haarsma, R.J. (Reindert); Haigh, I.D. (Ivan); Martinez, Andrew B.; et al. (2022): STORM climate change tropical cyclone wind speed return periods. 4TU.ResearchData. [Dataset]. DOI: https://doi.org/10.4121/14510817.v3',
      ],
    },
    dataSourceTable: {
      id: 'storm-cyclones',
      section: 'hazard',
      dataset: 'Tropical Cyclones (STORM)',
      source: {
        label: 'STORM Tropical Cyclone Maximum Windspeeds, Present and Future climate',
        url: 'https://data.4tu.nl/articles/dataset/STORM_tropical_cyclone_wind_speed_return_periods/12705164/3',
      },
      citation: [
        'Bloemendaal, Nadia; de Moel, H. (Hans); Muis, S; Haigh, I.D. (Ivan); Aerts, J.C.J.H. (Jeroen) (2020): STORM tropical cyclone wind speed return periods. 4TU.ResearchData. Dataset. DOI 10.4121/12705164.v3 and Bloemendaal, Nadia; de Moel, Hans; Dullaart, Job; Haarsma, R.J. (Reindert); Haigh, I.D. (Ivan); Martinez, Andrew B.; et al. (2022): STORM climate change tropical cyclone wind speed return periods. 4TU.ResearchData. Dataset. DOI 10.4121/14510817.v3, aggregated as Russell, Tom. (2022). STORM tropical cyclone wind speed return periods as global GeoTIFFs (1.0.0) [Data set]. Zenodo. DOI 10.5281/zenodo.7438145.',
      ],
      license: {
        label: 'CC0 1.0',
      },
      notes: [
        'Tropical cyclone maximum wind speed (in m/s) return periods, generated using the STORM climate change datasets. 1 in 10 to 1 in 10,000 year return periods at 10 km resolution. Baseline and RCP 8.5 climate scenarios. Current and future (2050) epochs.',
      ],
    },
  },
  {
    id: 'cyclone_iris',
    title: 'Tropical Cyclones (IRIS)',
    description:
      'IRIS tropical cyclone wind speed hazard at this site across multiple return periods, scenarios and climate models.',
    risk_data_type: ['hazard'],
    license: 'CC-BY-4.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_cyclone_iris',
          name: 'Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset. Scientific Data 11, 424 DOI 10.1038/s41597-024-03250-y and Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model. Figshare. Collection. DOI 10.6084/m9.figshare.c.6724251.v1',
          url: 'https://doi.org/10.1038/s41597-024-03250-y',
          type: 'dataset',
          risk_data_type: 'hazard',
          license: 'CC-BY-4.0',
        },
      ],
    },
    readme: {
      datasetDescription:
        'tropical cyclone wind speeds (Sparks and Toumi 2024; Russell 2022, derived from Bloemendaal et al 2020 and Bloemendaal et al 2022)',
      datasetSources: [
        'Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset. Scientific Data 11, 424 DOI https://doi.org/10.1038/s41597-024-03250-y',
        'Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model. Figshare. Collection. DOI https://doi.org/10.6084/m9.figshare.c.6724251.v1',
      ],
    },
    dataSourceTable: {
      id: 'iris-cyclones',
      section: 'hazard',
      dataset: 'Tropical Cyclones (IRIS)',
      source: {
        label: 'IRIS tropical cyclone model',
        url: 'https://www.imperial.ac.uk/grantham/research/climate-science/modelling-tropical-cyclones/',
      },
      citation: [
        'Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset. Scientific Data 11, 424 DOI 10.1038/s41597-024-03250-y and Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model. Figshare. Collection. DOI 10.6084/m9.figshare.c.6724251.v1.',
      ],
      license: {
        label: 'CC BY 4.0',
      },
      notes: [
        'Tropical cyclone maximum wind speeds (in m/s) generated using the IRIS tropical cyclone model. Wind speeds available from 1 in 10 to 1 in 1,000 year return periods at 1/10 degree spatial resolution. Present (2020) and future (2050) epochs, with SSP1-2.6, SSP2-4.5 and SSP5-8.5 future scenarios. Return period maps generated from an earlier version of the IRIS model event set.',
      ],
    },
  },
  {
    id: 'earthquake',
    title: 'Earthquake Ground Shaking',
    description:
      'Modelled Peak Ground Acceleration (PGA) with a 10% probability of being exceeded in 50 years.',
    risk_data_type: ['hazard'],
    license: 'CC-BY-NC-SA',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_gem_earthquake',
          name: 'Pagani M, Garcia-Pelaez J, Gee R, Johnson K, Silva V, Simionato M, Styron R, Vigano D, Danciu L, Monelli D, Poggi V, Weatherill G. (2019). The 2018 version of the Global Earthquake Model: Hazard component. Earthquake Spectra, 36(1), DOI: 10.1177/8755293020931866. and Johnson, K., Villani, M., Bayliss, K., Brooks, C., Chandrasekhar, S., Chartier, T., Chen, Y.-S., Garcia-Pelaez, J., Gee, R., Styron, R., Rood, A., Simionato, M., & Pagani, M. (2023). Global Seismic Hazard Map (v2023.1.0) [Data set]. Zenodo. DOI 10.5281/zenodo.8409647',
          url: 'https://doi.org/10.5281/zenodo.8409647',
          type: 'dataset',
          risk_data_type: 'hazard',
          license: 'CC-BY-NC-SA 4.0',
        },
      ],
    },
    readme: {
      datasetDescription: 'earthquake (Pagani et al 2019)',
      datasetSources: [
        'Pagani M, Garcia-Pelaez J, Gee R, Johnson K, Silva V, Simionato M, Styron R, Vigano D, Danciu L, Monelli D, Poggi V, Weatherill G. (2019). The 2018 version of the Global Earthquake Model: Hazard component. Earthquake Spectra, 36(1). DOI: https://doi.org/10.1177/8755293020931866',
      ],
    },
    dataSourceTable: {
      id: 'gem-earthquake',
      section: 'hazard',
      dataset: 'Seismic Risk',
      source: {
        label: 'GEM Global Earthquake Hazard Map',
        url: 'https://www.globalquakemodel.org/gem-maps/global-earthquake-hazard-map',
      },
      citation: [
        'Pagani M, Garcia-Pelaez J, Gee R, Johnson K, Silva V, Simionato M, Styron R, Vigano D, Danciu L, Monelli D, Poggi V, Weatherill G. (2019). The 2018 version of the Global Earthquake Model: Hazard component. Earthquake Spectra, 36(1), DOI: 10.1177/8755293020931866. Johnson, K., Villani, M., Bayliss, K., Brooks, C., Chandrasekhar, S., Chartier, T., Chen, Y.-S., Garcia-Pelaez, J., Gee, R., Styron, R., Rood, A., Simionato, M., & Pagani, M. (2023). Global Seismic Hazard Map (v2023.1.0) [Data set]. Zenodo. DOI 10.5281/zenodo.8409647.',
      ],
      license: {
        label:
          'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA)',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      },
      notes: [
        'The Global Earthquake Model (GEM) Global Seismic Hazard Map (version 2023.1) depicts the geographic distribution of the Peak Ground Acceleration (PGA) with a 10% probability of being exceeded in 50 years, computed for reference rock conditions (shear wave velocity, VS30, of 760-800 m/s).',
      ],
    },
  },
  {
    id: 'landslide',
    title: 'Landslide Susceptibility and Probabilities',
    description:
      'Landslide susceptibility and annual probabilities for earthquake and rainfall triggers at this site, based on a global gridded landslide hazard map.',
    risk_data_type: ['hazard'],
    license: 'CC-BY-NC-4.0',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_global_landslide_hazard_map',
          name: 'Arup (2021). Global Landslide Hazard Map, prepared for The World Bank and Global Facility for Disaster Reduction and Recovery.',
          url: 'https://datacatalog.worldbank.org/search/dataset/0037584/Global-landslide-hazard-map',
          type: 'dataset',
          risk_data_type: 'hazard',
          license: 'CC-BY-NC-4.0',
        },
      ],
    },
    readme: {
      datasetDescription:
        'landslide susceptibility and annual probabilities for earthquake and rainfall triggers',
      datasetSources: [
        'Arup (2021). Global Landslide Hazard Map, prepared for The World Bank and Global Facility for Disaster Reduction and Recovery.',
      ],
    },
    dataSourceTable: {
      id: 'landslide',
      section: 'hazard',
      dataset: 'Landslide',
      source: {
        label: 'Global Landslide Hazard Map',
        url: 'https://datacatalog.worldbank.org/search/dataset/0037584/Global-landslide-hazard-map',
      },
      citation: [
        'Arup (2021) Global Landslide Hazard Map, prepared for The World Bank and Global Facility for Disaster Risk Reduction.',
      ],
      license: {
        label: 'Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC-SA)',
        url: 'https://creativecommons.org/licenses/by-nc/4.0/',
      },
      notes: [
        'The Global Landslide hazard map is a gridded dataset of landslide hazard produced at the global scale. The dataset comprises gridded maps of estimated annual frequency of significant landslides per square kilometre. Significant landslides are those which are likely to have been reported had they occurred in a populated place; limited information on reported landslide size makes it difficult to tie frequencies to size ranges but broadly speaking would be at least greater than 100 m2. The data provides frequency estimates for each grid cell on land between 60S and 72N for landslides triggered by seismicity and rainfall.',
        'The dataset is publicly available for download and use and it consists of 4 global map layers: mean annual rainfall-triggered landslide hazard (1980-2018), median annual rainfall-triggered landslide hazard (1980-2018), mean annual earthquake-triggered landslide hazard, and an aggregate hazard index ranging from 1 (low) to 4 (very high).',
      ],
    },
  },
];
