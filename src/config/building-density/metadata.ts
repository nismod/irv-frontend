import { ValueLabel } from '@/lib/controls/params/value-label';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';

import {
  POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
  type RasterMetadataModule,
} from '../raster-metadata-types';

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

export const BUILDING_DENSITY_RASTER_METADATA: RasterMetadataModule = [
  {
    id: 'buildings',
    title: 'Built-up surface',
    description:
      'Built-up surface area at this site from GHS-BUILT-S R2023A, including total and non-residential built-up surface estimates derived from multitemporal satellite imagery.',
    risk_data_type: ['exposure'],
    license: 'CC-BY-NC-SA',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_ghs_built',
          name: 'Pesaresi M., Politis P. (2023). European Commission Joint Research Centre. doi:10.2905/9F06F36F-4B11-47EC-ABB0-4F8B7B1D72EA',
          url: 'https://human-settlement.emergency.copernicus.eu/ghs_buS2023.php',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'CC-BY-4.0',
        },
      ],
    },
    readme: {
      datasetDescription: 'built-up surface area by subtype (m2)',
      datasetSources: [
        'Pesaresi M., Politis P. (2023). GHS-BUILT-S R2023A - GHS built-up surface grid, derived from Sentinel2 composite and Landsat, multitemporal (1975-2030). European Commission Joint Research Centre. DOI: 10.2905/9F06F36F-4B11-47EC-ABB0-4F8B7B1D72EA',
      ],
    },
  },
];
