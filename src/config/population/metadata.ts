import {
  POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
  type RasterMetadataModule,
} from '../raster-metadata-types';

export const POPULATION_RASTER_METADATA: RasterMetadataModule = [
  {
    id: 'population',
    title: 'Population density',
    description:
      'Population density at this site from GHS-POP R2023A, a multitemporal global population grid derived from census and administrative estimates disaggregated to grid cells using GHSL built-up information.',
    risk_data_type: ['exposure'],
    license: 'CC-BY-NC-SA',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_ghs_pop',
          name: 'Schiavina M., Freire S., Carioli A., MacManus K. (2023). European Commission Joint Research Centre. doi:10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE',
          url: 'https://human-settlement.emergency.copernicus.eu/ghs_pop2023.php',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'CC-BY-4.0',
        },
      ],
    },
    readme: {
      datasetDescription: 'population density (people per km2)',
      datasetSources: [
        'Schiavina M., Freire S., Carioli A., MacManus K. (2023). GHS-POP R2023A - GHS population grid multitemporal (1975-2030). European Commission Joint Research Centre. DOI: 10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE',
      ],
    },
    dataSourceTable: {
      id: 'ghsl-population-built-up',
      section: 'exposure',
      dataset: 'Population and built-up area',
      source: {
        label: 'JRC Global Human Settlement Layer',
        url: 'https://human-settlement.emergency.copernicus.eu/',
      },
      citation: [
        'Schiavina, Marcello; Freire, Sergio; Alessandra Carioli; MacManus, Kytt (2023): GHS-POP R2023A - GHS population grid multitemporal (1975-2030). European Commission, Joint Research Centre (JRC) [Dataset] doi: 10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE PID: http://data.europa.eu/89h/2ff68a52-5b5b-4a22-8f40-c41da8332cfe.',
        'Pesaresi, Martino; Politis, Panagiotis (2023): GHS-BUILT-S R2023A - GHS built-up surface grid, derived from Sentinel2 composite and Landsat, multitemporal (1975-2030). European Commission, Joint Research Centre (JRC) [Dataset] doi: 10.2905/9F06F36F-4B11-47EC-ABB0-4F8B7B1D72EA PID: http://data.europa.eu/89h/9f06f36f-4b11-47ec-abb0-4f8b7b1d72ea.',
        'Schiavina, M., Melchiorri, M., Pesaresi, M., Politis, P., Carneiro Freire, S.M., Maffenini, L., Florio, P., Ehrlich, D., Goch, K., Carioli, A., Uhl, J., Tommasi, P. and Kemper, T., GHSL Data Package 2023, Publications Office of the European Union, Luxembourg, 2023, ISBN 978-92-68-02341-9, doi:10.2760/098587, JRC133256.',
      ],
      license: {
        label: 'CC-BY 4.0',
        url: 'https://ec.europa.eu/info/legal-notice_en#copyright-notice',
      },
      notes: [
        'GHS-POP R2023A depicts the distribution of population, expressed as the number of people per cell. Residential population estimates between 1975 and 2020 in 5 year intervals and projections to 2025 and 2030 derived from CIESIN GPWv4.11 were disaggregated from census or administrative units to grid cells, informed by the distribution, density, and classification of built-up as mapped in the Global Human Settlement Layer (GHSL) global layer per corresponding epoch.',
        'This dataset is an update of the product released in 2022. Major improvements include use of built-up volume maps (GHS-BUILT-V R2022A), more recent and detailed population estimates derived from GPWv4.11 integrating both UN World Population Prospects 2022 country population data and World Urbanisation Prospects 2018 data on Cities, revision of GPWv4.11 population growthrates by convergence to upper administrative level growthrates, systematic improvement of census coastlines, revision of census units declared as unpopulated, integration of non-residential built-up volume information (GHS-BUILT-V_NRES R2023A), 100m Mollweide spatial resolution (and 3 arcseconds in WGS84), and projections to 2030.',
        'GHS-BUILT-S R2023A depicts the distribution of built-up (BU) surfaces estimates between 1975 and 2030 in 5 year intervals and two functional use components: total BU surface and non-residential BU surface. The data is made by spatial-temporal interpolation of five observed collections of multiple-sensor, multiple-platform satellite imageries. Landsat supports the 1975, 1990, 2000, and 2014 epochs. Sentinel2 composite supports the 2018 epoch.',
        'The built-up surface fraction (BUFRAC) is estimated at 10m spatial resolution from S2 image data, using a learning set composed from GHS-BUILT-S2 R2020A, Facebook, Microsoft, and Open Street Map building delineation. BUFRAC inference is made from quantized image features through associative rule learning applied to spatial data analytics.',
        'The non-residential domain is predicted from S2 image data by observation of radiometric, textural, and morphological features in an object-oriented image processing framework. The multi-temporal dimension is provided by testing symbolic machine learning associations between Landsat imagery in past epochs and built-up/non-built-up class abstractions on image segments extracted from S2 images. Spatial-temporal interpolation is solved by rank-optimal spatial allocation using explanatory variables related to landscape and observed dynamics of built-up surfaces.',
      ],
    },
  },
];
