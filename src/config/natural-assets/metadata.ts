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
    description:
      'Biodiversity Intactness Index (BII) is the average abundance of originally present species across a broad range of species, relative to abundance in an undisturbed habitat. This dataset is a map of terrestrial BII estimated globally on a 3 arc sec grid.',
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
          id: 'source_biodiversity_intactness_index_data',
          name: 'Tim Newbold; Lawrence Hudson; Andy Arnell; Sara Contu et al. (2016). Map of Biodiversity Intactness Index (from Global map of the Biodiversity Intactness Index, from Newbold et al. (2016) Science) [Data set resource]. Natural History Museum. Available online at: https://data.nhm.ac.uk.',
          type: 'dataset',
          risk_data_type: ['vulnerability'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_biodiversity_intactness_index_paper',
          name: 'Tim Newbold et al. (2016) Has land use pushed terrestrial biodiversity beyond the planetary boundary? A global assessment. Science 353, 288-291. DOI: https://doi.org/10.1126/science.aaf2201',
        },
      ],
    },
  },
  {
    id: 'forest-landscape-integrity-index',
    title: 'Forest Integrity',
    description: `The Forest Landscape Integrity Index (FLII) was constructed based on three main data inputs: (1) observed pressures (infrastructure, agriculture, tree cover loss), (2) inferred pressure modeled based on proximity to the observed pressures, and (3) change in forest connectivity, resulting in an index estimated globally on a 10 arc sec grid.

FLII scores range from 0 (lowest integrity) to 10 (highest). The authors discretized this range to define three broad illustrative categories: low (≤6.0); medium (>6.0 and <9.6); and high integrity (≥9.6) by benchmarking against reference locations worldwide.`,
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
          name: 'Grantham, H.S., Duncan, A., Evans, T.D. et al. Anthropogenic modification of forests means only 40% of remaining forests have high ecosystem integrity. Nat Commun 11, 5978 (2020). DOI: https://doi.org/10.1038/s41467-020-19493-3',
          type: 'dataset',
          risk_data_type: ['vulnerability'],
          license: 'https://www.forestlandscapeintegrity.com/download-data',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
