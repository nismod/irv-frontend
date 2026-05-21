import { ValueLabel } from '@/lib/controls/params/value-label';

import {
  POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
  type RasterMetadataModule,
} from '../raster-metadata-types';

export const METRIC_TYPES = ['absolute', 'relative'] as const;

export type CDDType = (typeof METRIC_TYPES)[number];

export const METRIC_VALUE_LABELS: ValueLabel<CDDType>[] = [
  {
    value: 'absolute',
    label: 'Mean absolute Change (days per year)',
  },
  {
    value: 'relative',
    label: 'Relative Change',
  },
];

export const CDD_RASTER_METADATA: RasterMetadataModule = [
  {
    id: 'cdd_miranda',
    title: 'Cooling Degree Days',
    description:
      'Change in cooling degree days at this site between 1.5C and 2C global warming scenarios, expressed as absolute and relative metrics.',
    risk_data_type: ['hazard'],
    license: 'CC-BY',
    lineage: {
      description: POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_cooling_degree_days',
          name: 'Miranda, N.D., Lizana, J., Sparrow, S.N. et al. (2023). Change in cooling degree days with global mean temperature rise increasing from 1.5C to 2.0C. Nature Sustainability 6, 1326-1330. doi:10.1038/s41893-023-01155-z. Data: Miranda, N.D., Lizana, J., Sparrow, S.N., Wallom, D.C.H., Zachau-Walker, M., Watson, P., Khosla, R., & McCulloch, M. (2023). Changes in Cooling Degree Days (CDD) between the 1.5C and 2.0C global warming scenarios. University of Oxford.',
          url: 'https://doi.org/10.1038/s41893-023-01155-z',
          type: 'dataset',
          risk_data_type: 'hazard',
          license: 'CC-BY',
        },
      ],
    },
    readme: {
      datasetDescription:
        'cooling degree days change between the 1.5C and 2.0C global warming scenarios',
      datasetSources: [
        'Miranda, N.D., Lizana, J., Sparrow, S.N. et al. (2023). Change in cooling degree days with global mean temperature rise increasing from 1.5C to 2.0C. Nature Sustainability 6, 1326-1330. DOI: https://doi.org/10.1038/s41893-023-01155-z',
        'Miranda, N. D., Lizana, J., Sparrow, S. N., Wallom, D. C. H., Zachau-Walker, M., Watson, P., Khosla, R., & McCulloch, M. (2023). Changes in Cooling Degree Days (CDD) between the 1.5C and 2.0C global warming scenarios. University of Oxford. https://ora.ox.ac.uk/objects/uuid:8d95c423-816c-4a4f-88b6-eb7a040cb40e',
      ],
    },
    dataSourceTable: {
      id: 'cooling-demand',
      section: 'risk',
      dataset: 'Cooling demand',
      source: {
        label: 'Global CDD difference between 1.5C and 2C global warming scenarios.',
      },
      citation: [
        'Miranda, N.D., Lizana, J., Sparrow, S.N. et al. (2023) Change in cooling degree days with global mean temperature rise increasing from 1.5C to 2.0C. Nature Sustainability 6, 1326-1330. DOI 10.1038/s41893-023-01155-z.',
        'Miranda, N. D., Lizana, J., Sparrow, S. N., Wallom, D. C. H., Zachau-Walker, M., Watson, P., Khosla, R., & McCulloch, M. (2023). Changes in Cooling Degree Days (CDD) between the 1.5C and 2.0C global warming scenarios. University of Oxford. https://ora.ox.ac.uk/objects/uuid:8d95c423-816c-4a4f-88b6-eb7a040cb40e.',
      ],
      license: {
        label: 'CC-BY',
      },
      notes: [
        'Absolute and relative mean increase of cooling degree days (CDDs) from 1.5C to 2C global warming scenarios. Additionally, the standard deviation is provided. The data has a horizontal resolution of 0.833 longitude and 0.556 latitude over the land surface. These annual CDDs and standard deviation globally were calculated using an ensemble of 700 simulations per climate change scenario. Cooling degree days were calculated for the ensemble members using the temperature threshold of 18C. Then, annual mean CDDs and standard deviation per coordinate across ensemble members were obtained for the 1.5C and 2C scenarios. Finally, absolute and relative differences between 1.5C and 2C were computed. The climate data, involving 700 simulations per scenario, was generated using the HadAM4P Atmosphere-only General Circulation Model (AGCM) from the UK Met Office Hadley Centre. Three scenarios were generated: historical (2006-16), 1.5C and 2C. The simulation outputs were mean temperatures with a 6-hour timestep and a horizontal resolution of 0.833 longitude and 0.556 latitude. Simulations took place within climateprediction.net (CPDN) climate simulation, which uses the Berkeley Open Infrastructure for Network Computing (BOINC) framework. Biases in simulated temperature were identified and corrected using a quantile mapping approach.',
      ],
    },
  },
];
