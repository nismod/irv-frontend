import { ValueLabel } from '@/lib/controls/params/value-label';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const NATURE_RASTER_TYPES = [
  'biodiversity_intactness',
  'forest_landscape_integrity',
  'organic_carbon',
] as const;

export type NatureRasterType = (typeof NATURE_RASTER_TYPES)[number];

export const NATURE_RASTER_VALUE_LABELS: ValueLabel<NatureRasterType>[] = [
  {
    value: 'biodiversity_intactness',
    label: 'Biodiversity Intactness',
  },
  {
    value: 'forest_landscape_integrity',
    label: 'Forest Landscape Integrity',
  },
  {
    value: 'organic_carbon',
    label: 'Soil Organic Carbon',
  },
];

export const NATURAL_ASSETS_LAYER_METADATA = [
  {
    id: 'soil_organic_carbon',
    title: 'Soil Organic Carbon (SoilGrids)',
    description:
      'Soil organic carbon content at 0-30cm, in tonnes/hectare, aggregated to 1000m grid. Soil organic carbon content (fine earth fraction) in dg/kg at 6 standard depths. Predictions were derived using a digital soil mapping approach based on Quantile Random Forest, drawing on a global compilation of soil profile data and environmental layers. This map is the result of resampling the mean SoilGrids 250 m predictions (Poggio et al. 2021) for each 1000 m cell.',
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'SoilGrids' },
    contact_point: { name: 'L. Poggio' },
    creator: { name: 'L. Poggio' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_soilgrids_2_0',
        title: 'SoilGrids 2.0',
        description: '',
        access_url: 'https://soilgrids.org/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_soilgrids_2_0',
          name: 'Poggio, L., de Sousa, L.M., Batjes, N.H., Heuvelink, G.B.M., Kempen, B., Ribeiro, E., Rossiter, D., 2021. SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. SOIL 7, 217-240. https://doi.org/10.5194/soil-7-217-2021.',
          url: 'https://soilgrids.org/',
          type: 'dataset',
          risk_data_type: ['exposure'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'biodiversity-intactness-index',
    title: 'Biodiversity',
    description: '3 arcsec grid.',
    risk_data_type: ['vulnerability'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Natural History Museum' },
    contact_point: { name: 'Tim Newbold' },
    creator: { name: 'Tim Newbold' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_biodiversity_intactness_index',
        title: 'Biodiversity Intactness Index',
        description: '',
        access_url:
          'https://data.nhm.ac.uk/dataset/global-map-of-the-biodiversity-intactness-index-from-newbold-et-al-2016-science/resource/8531b4dc-bd44-4586-8216-47b3b8d60e85',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_biodiversity_intactness_index_citation_1',
          name: 'Tim Newbold; Lawrence Hudson; Andy Arnell; Sara Contu et al. (2016). Map of Biodiversity Intactness Index (from Global map of the Biodiversity Intactness Index, from Newbold et al. (2016) Science) [Data set resource]. Natural History Museum. Available online at: https://data.nhm.ac.uk.',
          type: 'dataset',
          risk_data_type: ['vulnerability'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
  {
    id: 'forest-landscape-integrity-index',
    title: 'Forest Integrity',
    description:
      '10 arcsec grid. Data are available at www.forestlandscapeintegrity.com. The datasets used to develop the Forest Landscape Integrity Index can be found at the following websites: tree cover and loss http://earthenginepartners.appspot.com/science-2013-global-forest, tree cover loss driver https://data.globalforestwatch.org/datasets/f2b7de1bdde04f7a9034ecb363d71f0e, potential forest cover https://data.globalforestwatch.org/datasets/potential-forest-coverage, ESA-CCI Land Cover https://maps.elie.ucl.ac.be/CCI/viewer/index.php, Open Street Maps https://www.openstreetmap.org, croplands https://lpdaac.usgs.gov/news/release-of-gfsad-30-meter-cropland-extent-products/, surface water https://global-surface-water.appspot.com/, protected areas https://www.protectedplanet.net/en.',
    risk_data_type: ['vulnerability'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'H.S. Grantham' },
    contact_point: { name: 'H.S. Grantham' },
    creator: { name: 'H.S. Grantham' },
    license: 'https://www.forestlandscapeintegrity.com/download-data',
    resources: [
      {
        id: 'source_forest_landscape_integrity_index',
        title: 'Forest Landscape Integrity Index',
        description: '',
        access_url: 'https://www.forestlandscapeintegrity.com/download-data',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_forest_landscape_integrity_index_citation_1',
          name: 'Grantham, H.S., Duncan, A., Evans, T.D. et al. Anthropogenic modification of forests means only 40% of remaining forests have high ecosystem integrity. Nat Commun 11, 5978 (2020). DOI: 10.1038/s41467-020-19493-3.',
          type: 'dataset',
          risk_data_type: ['vulnerability'],
          license: 'https://www.forestlandscapeintegrity.com/download-data',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
