import { ValueLabel } from '@/lib/controls/params/value-label';

import {
  POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
  type RasterMetadataModule,
} from '../raster-metadata-types';

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

export const NATURAL_ASSETS_RASTER_METADATA: RasterMetadataModule = [
  {
    id: 'soil_organic_carbon',
    title: 'Soil organic carbon',
    description:
      'Soil organic carbon stock at this site from SoilGrids 2.0, representing 0-30cm soil organic carbon content aggregated to a 1000m grid.',
    risk_data_type: ['exposure'],
    license: 'CC-BY-NC-SA',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_soilgrids_2_0',
          name: 'Poggio, L., de Sousa, L.M., Batjes, N.H., Heuvelink, G.B.M., Kempen, B., Ribeiro, E., Rossiter, D. (2021). SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. SOIL 7, 217-240. doi:10.5194/soil-7-217-2021. Predictions were derived using digital soil mapping based on Quantile Random Forest, drawing on a global compilation of soil profile data and environmental layers.',
          url: 'https://soilgrids.org/',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'CC-BY 4.0',
        },
      ],
    },
    readme: {
      datasetDescription: 'soil organic carbon (t/ha)',
      datasetSources: [
        'Poggio, L., de Sousa, L.M., Batjes, N.H., Heuvelink, G.B.M., Kempen, B., Ribeiro, E., Rossiter, D. (2021). SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. SOIL 7, 217-240. https://doi.org/10.5194/soil-7-217-2021',
      ],
    },
    dataSourceTable: {
      id: 'soilgrids-organic-carbon',
      section: 'exposure',
      dataset: 'Soil Organic Carbon stock',
      source: {
        label: 'SoilGrids 2.0',
        url: 'https://soilgrids.org/',
      },
      citation: [
        'Poggio, L., de Sousa, L.M., Batjes, N.H., Heuvelink, G.B.M., Kempen, B., Ribeiro, E., Rossiter, D., 2021. SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. SOIL 7, 217-240. https://doi.org/10.5194/soil-7-217-2021.',
      ],
      license: {
        label: 'CC-BY 4.0',
      },
      notes: [
        'Soil organic carbon content at 0-30cm, in tonnes/hectare, aggregated to 1000m grid. Soil organic carbon content (fine earth fraction) in dg/kg at 6 standard depths. Predictions were derived using a digital soil mapping approach based on Quantile Random Forest, drawing on a global compilation of soil profile data and environmental layers. This map is the result of resampling the mean SoilGrids 250 m predictions (Poggio et al. 2021) for each 1000 m cell.',
      ],
    },
  },
];
