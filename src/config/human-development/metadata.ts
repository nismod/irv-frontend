import { ValueLabel } from '@/lib/controls/params/value-label';

import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

export const HDI_REGION_LEVELS = ['countries', 'regions'] as const;

export type HdiRegionLevel = (typeof HDI_REGION_LEVELS)[number];

export const HDI_REGION_LEVEL_LABELS: ValueLabel<HdiRegionLevel>[] = [
  {
    value: 'countries',
    label: 'Countries',
  },
  {
    value: 'regions',
    label: 'Regions',
  },
];

export const HDI_REGION_LEVEL_METADATA = {
  countries: {
    nameField: 'country',
  },
  regions: {
    nameField: 'region',
  },
};

export const HDI_VARIABLES = [
  'subnational_hdi',
  'health_index',
  'educational_index',
  'income_index',
] as const;

export type HdiVariableType = (typeof HDI_VARIABLES)[number];

export const HDI_VARIABLE_LABELS: ValueLabel<HdiVariableType>[] = [
  {
    value: 'subnational_hdi',
    label: 'Human Development Index',
  },
  {
    value: 'health_index',
    label: 'Health Index',
  },
  {
    value: 'educational_index',
    label: 'Educational Index',
  },
  {
    value: 'income_index',
    label: 'Income Index',
  },
];

export const HUMAN_DEVELOPMENT_LAYER_METADATA = [
  {
    id: 'subnational-human-development',
    title: 'Human Development (Subnational)',
    description:
      "Development, Health, Education and Income indices for 186 countries, 1783 sub-national regions. The SHDI is an average of the subnational values of three dimensions: education, health and standard of living. To compute the SHDI on the basis of the three dimension indices, the geometric mean of the three indices is taken. Three major data sources were used to create the SHDI database: statistical offices (including Eurostat, the statistical office of the European Union), the Area Database of the Global Data Lab, and data from the HDI website of the Human Development Report Office of the United Nations Development Program. Given that household surveys and censuses are not held every year, for many countries the indicators are only available for a restricted number of years. To obtain their values for the whole period 1990-2017, the missing information was estimated by interpolation or extrapolation techniques. This estimation process was facilitated by the fact that the UNDP Database contains the national values for all four indicators for each year in this period, which means that only the subnational variation had to be interpolated or extrapolated. For a complete list of sources and surveys used, please refer to the Area Database's Data Sources page.",
    risk_data_type: ['vulnerability'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Global Data Lab' },
    contact_point: { name: 'Global Data Lab' },
    creator: { name: 'Global Data Lab' },
    license: 'https://globaldatalab.org/termsofuse',
    resources: [
      {
        id: 'source_subnational_human_development',
        title: 'Global Data Lab Sub-national human development indices',
        description: '',
        access_url: 'https://globaldatalab.org/shdi/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_subnational_human_development_citation_1',
          name: 'Global Data Lab (2019) Subnational Human Development Index (SHDI) Available online: https://globaldatalab.org/shdi/.',
          type: 'dataset',
          risk_data_type: 'vulnerability',
          license: 'https://globaldatalab.org/termsofuse',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
