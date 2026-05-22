import type { DataSourceMetadataModule } from '../data-source-metadata-types';

export const POWER_PLANTS_DATA_SOURCE_ROWS: DataSourceMetadataModule = [
  {
    id: 'wri-global-powerplants',
    section: 'exposure',
    dataset: 'Power plants',
    source: {
      label: 'WRI Global Powerplants Database',
      url: 'https://datasets.wri.org/dataset/globalpowerplantdatabase',
    },
    citation: [
      'Global Energy Observatory, Google, KTH Royal Institute of Technology in Stockholm, Enipedia, World Resources Institute. 2018. Global Power Plant Database. Published on Resource Watch and Google Earth Engine; http://resourcewatch.org/ https://earthengine.google.com/.',
    ],
    license: {
      label: 'CC BY 4.0',
    },
    notes: [
      "The Global Power Plant Database is a comprehensive, open source database of power plants around the world. It centralizes power plant data to make it easier to navigate, compare and draw insights for one's own analysis. The database covers approximately 35,000 power plants from 167 countries and includes thermal plants (e.g. coal, gas, oil, nuclear, biomass, waste, geothermal) and renewables (e.g. hydro, wind, solar). Each power plant is geolocated and entries contain information on plant capacity, generation, ownership, and fuel type.",
    ],
  },
];
