import { ValueLabel } from '@/lib/controls/params/value-label';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const BUILDING_DENSITY_TYPES = ['all', 'non_residential'] as const;

export type BuildingDensityType = (typeof BUILDING_DENSITY_TYPES)[number];

export const BUILDING_DENSITY_TYPE_LABELS: ValueLabel<BuildingDensityType>[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'non_residential',
    label: 'Non-residential',
  },
];

export const BUILDING_DENSITY_COLORMAPS: Record<BuildingDensityType, RasterContinuousColorMap> = {
  all: {
    type: 'continuous',
    scheme: 'orrd',
    range: [0, 500_000],
    rangeTruncated: [false, true],
  },
  non_residential: {
    type: 'continuous',
    scheme: 'purples',
    range: [0, 300_000],
    rangeTruncated: [false, false],
  },
};

export const BUILDING_DENSITY_LAYER_METADATA = [
  {
    id: 'buildings',
    title: 'Built-up surface (JRC GHSL)',
    description: `GHS-BUILT-S R2023A - The spatial raster dataset depicts the distribution of the built-up (BU) surfaces estimates between 1975 and 2030 in 5 years intervals and two functional use components a) the total BU surface and b) the non-residential (NRES) BU surface. The data is made by spatial-temporal interpolation of five observed collections of multiple-sensor, multiple-platform satellite imageries. Landsat (MSS, TM, ETM sensor) supports the 1975, 1990, 2000, and 2014 epochs. Sentinel2 (S2) composite (GHS-composite-S2 R2020A) supports the 2018 epoch.

The built-up surface fraction (BUFRAC) is estimated at 10m of spatial resolution from the S2 image data, using as learning set a composite of data from GHS-BUILT-S2 R2020A, Facebook, Microsoft, and Open Street Map (OSM) building delineation. The BUFRAC inference is made from the combination of quantized image features (reflectance, derivative of morphological profile DMP) through associative rule learning applied to spatial data analytics, which was introduced as symbolic machine learning (SML).

The non-residential (NRES) domain is predicted from S2 image data by observation of radiometric, textural, and morphological features in an object-oriented image processing framework. The multi-temporal dimension is provided by testing by the SML the association between the combination of the quantized radiometric information collected by the Landsat imagery in the past epochs, and the “built-up” (BU) and “non-built-up” (NBU) class abstraction on image segments extracted from S2 images. The spatial-temporal interpolation is solved by rank-optimal spatial allocation using explanatory variables related to the landscape (slope, elevation, distance to water, and distance to vegetation) and related to the observed dynamic of BU surfaces in the past epochs.`,
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'European Commission Joint Research Centre' },
    contact_point: { name: 'Martino Pesaresi' },
    creator: { name: 'Martino Pesaresi' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_ghs_built',
        title: 'JRC Global Human Settlement Layer',
        description: '',
        access_url: 'https://human-settlement.emergency.copernicus.eu/ghs_buS2023.php',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_ghs_built',
          name: 'Pesaresi M., Politis P. (2023). GHS-BUILT-S R2023A - GHS built-up surface grid, derived from Sentinel2 composite and Landsat, multitemporal (1975-2030). European Commission Joint Research Centre. DOI: https://doi.org/10.2905/9F06F36F-4B11-47EC-ABB0-4F8B7B1D72EA',
          url: 'http://data.europa.eu/89h/9f06f36f-4b11-47ec-abb0-4f8b7b1d72ea',
          type: 'dataset',
          risk_data_type: ['exposure'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_ghs_package',
          name: 'Schiavina, M., Melchiorri, M., Pesaresi, M., Politis, P., Carneiro Freire, S.M., Maffenini, L., Florio, P., Ehrlich, D., Goch, K., Carioli, A., Uhl, J., Tommasi, P. and Kemper, T., GHSL Data Package 2023, Publications Office of the European Union, Luxembourg, 2023, ISBN 978-92-68-02341-9, DOI: https://doi.org/10.2760/098587 JRC133256.',
          url: 'https://doi.org/10.2760/098587',
          type: 'dataset',
          risk_data_type: ['exposure'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
