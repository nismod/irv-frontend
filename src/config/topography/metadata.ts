import { ValueLabel } from '@/lib/controls/params/value-label';

import {
  POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
  type RasterMetadataModule,
} from '../raster-metadata-types';

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

export const TOPOGRAPHY_RASTER_METADATA: RasterMetadataModule = [
  {
    id: 'dem',
    title: 'Topography (DEM)',
    description:
      'Elevation (metres above sea level) and slope (degrees) at this site from global MERIT DEM derivatives produced at 250m resolution.',
    risk_data_type: ['exposure'],
    license: 'CC-BY-NC-SA',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_global_dem_derivatives_merit_dem',
          name: 'Hengl, T. (2018). Global DEM derivatives at 250m, 1 km and 2 km based on the MERIT DEM (1.0) [Data set]. Zenodo. doi:10.5281/zenodo.1447210. MERIT DEM was first reprojected to 6 global tiles based on the Equi7 grid system and then used to derive DEM derivatives.',
          url: 'https://doi.org/10.5281/zenodo.1447210',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'CC-BY-SA 4.0',
        },
      ],
    },
    readme: {
      datasetDescription: 'topography: elevation (m a.s.l.) and slope (degrees) from DEM',
      datasetSources: [
        'Tomislav Hengl. (2018). Global DEM derivatives at 250m, 1 km and 2 km based on the MERIT DEM (1.0) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.1447210',
      ],
    },
    dataSourceTable: {
      id: 'global-dem-derivatives-merit-dem',
      section: 'exposure',
      dataset: 'Topography',
      source: {
        label: 'Global DEM derivatives based on MERIT DEM',
        url: 'https://doi.org/10.5281/zenodo.1447210',
      },
      citation: [
        'Tomislav Hengl. (2018). Global DEM derivatives at 250m, 1 km and 2 km based on the MERIT DEM (1.0) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.1447210.',
      ],
      license: {
        label: 'CC-BY-SA 4.0',
      },
      notes: [
        'DEM derivatives computed using SAGA GIS at 250m and using MERIT DEM (Yamazaki et al., 2017) as input. Antarctica is not included. MERIT DEM was first reprojected to 6 global tiles based on the Equi7 grid system (Bauer-Marschallinger et al. 2014) and then these were used to derive all DEM derivatives. To access original DEM tiles please refer to the MERIT DEM download page: http://hydro.iis.u-tokyo.ac.jp/~yamadai/MERIT_DEM/.',
      ],
    },
  },
];
