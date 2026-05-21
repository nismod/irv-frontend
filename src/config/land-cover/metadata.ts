import {
  POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
  type RasterMetadataModule,
} from '../raster-metadata-types';

export const LAND_COVER_RASTER_METADATA: RasterMetadataModule = [
  {
    id: 'land_cover',
    title: 'Land cover',
    description:
      'Land cover class at this site from ESA Climate Change Initiative land cover classification gridded maps derived from satellite observations.',
    risk_data_type: ['exposure'],
    license: 'CC-BY-NC-SA',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_esa_cci_land_cover',
          name: 'European Space Agency Climate Change Initiative Land Cover project (2021). Land cover classification gridded maps from 1992 to present derived from satellite observations, v2.1.1. doi:10.24381/cds.006f2c9a. The source data are from the ESA Climate Change Initiative Land Cover project led by UCLouvain, ESA Climate Change Initiative - Land Cover project 2020, and EC C3S Land Cover.',
          url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-land-cover?tab=overview',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'ESA CCI',
        },
      ],
    },
    readme: {
      datasetDescription: 'land cover (categorical class codes; same legend as map layer)',
      datasetSources: [
        'European Space Agency Climate Change Initiative Land Cover project (2021). Land cover classification gridded maps from 1992 to present derived from satellite observations, v2.1.1. DOI: https://doi.org/10.24381/cds.006f2c9a',
      ],
    },
    dataSourceTable: {
      id: 'esa-cci-land-cover',
      section: 'exposure',
      dataset: 'Land Cover',
      source: {
        label: 'ESA Land cover classification',
        url: 'https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-land-cover?tab=overview',
      },
      citation: [
        'European Space Agency Climate Change Initiative Land Cover project (2021) Land cover classification gridded maps from 1992 to present derived from satellite observations, v2.1.1. https://doi.org/10.24381/cds.006f2c9a.',
      ],
      license: {
        label: 'ESA CCI',
      },
      notes: [
        'The source of these data are the ESA Climate Change Initiative and in particular its Land Cover project, ESA Climate Change Initiative Land Cover led by UCLouvain (2017), ESA Climate Change Initiative - Land Cover project 2020, and EC C3S Land Cover.',
      ],
    },
  },
];
