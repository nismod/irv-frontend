import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const POPULATION_LAYER_METADATA = [
  {
    id: 'population',
    title: 'Population (JRC GHSL)',
    description: `GHS-POP R2023A depicts the distribution of population, expressed as the number of people per cell. Residential population estimates between 1975 and 2020 in 5 year intervals and projections to 2025 and 2030 derived from CIESIN GPWv4.11 were disaggregated from census or administrative units to grid cells, informed by the distribution, density, and classification of built-up as mapped in the Global Human Settlement Layer (GHSL) global layer per corresponding epoch.

This dataset is an update of the product released in 2022. Major improvements are the following: use of built-up volume maps (GHS-BUILT-V R2022A); use of more recent and detailed population estimates derived from GPWv4.11 integrating both UN World Population Prospects 2022 country population data and World Urbanisation Prospects 2018 data on Cities; revision of GPWv4.11 population growth rates by convergence to upper administrative level growth rates; systematic improvement of census coastlines; systematic revision of census units declared as unpopulated; integration of non-residential built-up volume information (GHS-BUILT-V_NRES R2023A); spatial resolution of 100m Mollweide (and 3 arcseconds in WGS84); projections to 2030.`,
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'European Commission Joint Research Centre' },
    contact_point: { name: 'Marcello Schiavina' },
    creator: { name: 'Marcello Schiavina' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_ghsl_population_built_up',
        title: 'JRC Global Human Settlement Layer',
        description: '',
        access_url: 'https://human-settlement.emergency.copernicus.eu/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_ghs_pop',
          name: 'Schiavina, Marcello; Freire, Sergio; Alessandra Carioli; MacManus, Kytt (2023): GHS-POP R2023A - GHS population grid multitemporal (1975-2030). European Commission, Joint Research Centre (JRC) [Dataset] doi: 10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE PID: http://data.europa.eu/89h/2ff68a52-5b5b-4a22-8f40-c41da8332cfe',
          url: 'https://human-settlement.emergency.copernicus.eu/ghs_pop2023.php',
          type: 'dataset',
          risk_data_type: ['exposure'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          id: 'source_ghsl_data_package',
          name: 'Schiavina, M., Melchiorri, M., Pesaresi, M., Politis, P., Carneiro Freire, S.M., Maffenini, L., Florio, P., Ehrlich, D., Goch, K., Carioli, A., Uhl, J., Tommasi, P. and Kemper, T., GHSL Data Package 2023, Publications Office of the European Union, Luxembourg, 2023, ISBN 978-92-68-02341-9, doi: https://doi.org/10.2760/098587 JRC133256.',
          type: 'dataset',
          risk_data_type: ['exposure'],
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
