import { ValueLabel } from '@/lib/controls/params/value-label';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const DEM_RASTER_TYPES = ['elevation', 'slope'] as const;

export type TopographyType = (typeof DEM_RASTER_TYPES)[number];

export const DEM_RASTER_VALUE_LABELS: ValueLabel<TopographyType>[] = [
  {
    value: 'elevation',
    label: 'Elevation',
  },
  {
    value: 'slope',
    label: 'Slope',
  },
];

export const TOPOGRAPHY_LAYER_METADATA = [
  {
    id: 'dem',
    title: 'Topography',
    description:
      'DEM derivatives computed using SAGA GIS at 250m and using MERIT DEM (Yamazaki et al., 2017) as input. Antarctica is not included. MERIT DEM was first reprojected to 6 global tiles based on the Equi7 grid system (Bauer-Marschallinger et al. 2014) and then these were used to derive all DEM derivatives. To access original DEM tiles please refer to the MERIT DEM download page: http://hydro.iis.u-tokyo.ac.jp/~yamadai/MERIT_DEM/.',
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Tomislav Hengl' },
    contact_point: { name: 'Tomislav Hengl' },
    creator: { name: 'Tomislav Hengl' },
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    resources: [
      {
        id: 'source_global_dem_derivatives_merit_dem',
        title: 'Global DEM derivatives based on MERIT DEM',
        description: '',
        access_url: 'https://doi.org/10.5281/zenodo.1447210',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_global_dem_derivatives_merit_dem',
          name: 'Tomislav Hengl. (2018). Global DEM derivatives at 250m, 1 km and 2 km based on the MERIT DEM (1.0) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.1447210.',
          url: 'https://doi.org/10.5281/zenodo.1447210',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'https://creativecommons.org/licenses/by-sa/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
