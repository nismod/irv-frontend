import _ from 'lodash';
import { FC, useMemo } from 'react';

import { ReturnPeriodChart } from '../charts/return-period-chart';
import { toReturnPeriodRows } from '../data-transforms';
import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../download/download-context';
import { buildDomainExportFile } from '../download/download-generators';
import {
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../download/metadata-common';
import { DatapackageTableSchemaField, RdlsDataset } from '../download/metadata-types';
import { HazardAccordion } from '../hazard-accordion';
import { calculateRagFromReturnPeriodValuesOneThreshold } from '../rag/rag-calculation';
import { RagStatus } from '../rag/rag-types';
import {
  ChartConfig,
  HazardComponentProps,
  PixelRecord,
  PixelRecordKeys,
  ReturnPeriodRow,
} from '../types';

// Cyclone STORM-specific key type definition
export interface CycloneStormKeys extends PixelRecordKeys {
  rp?: string;
  epoch?: string;
  rcp?: string;
  gcm?: string;
}

// Chart config
const stormCycloneChartConfig: ChartConfig = {
  id: 'cyclone-storm',
  title: 'Tropical cyclones – STORM',
  xLabel: 'Return period (years)',
  yLabel: 'Wind speed (m/s)',
  // STORM cyclones: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
};

// Thresholds
// Threshold for cyclone intensity above which damages are substantial
const CYCLONE_INTENSITY_THRESHOLD = 50; // TODO: Make this configurable or derive from domain knowledge

// Type guard for Cyclone STORM records
const isCycloneStormRecord = (record: PixelRecord): record is PixelRecord<CycloneStormKeys> => {
  return record.layer.domain === 'cyclone_storm';
};

// Filter function for Cyclone STORM records
const filterCycloneStormRecords = (records: PixelRecord[]): PixelRecord<CycloneStormKeys>[] => {
  return records.filter(isCycloneStormRecord);
};

const cycloneStormBaseName = 'cyclone_storm';
const cycloneStormColumns: DatapackageTableSchemaField[] = [
  { name: 'rp', type: 'number', title: 'Return period', description: 'Return period (years).' },
  {
    name: 'epoch',
    type: 'string',
    title: 'Epoch',
    description: 'Time period or epoch of the simulation.',
  },
  {
    name: 'rcp',
    type: 'string',
    title: 'RCP',
    description: 'Representative Concentration Pathway scenario.',
  },
  { name: 'gcm', type: 'string', title: 'GCM', description: 'Global Climate Model identifier.' },
  { name: 'value', type: 'number', title: 'Wind speed', description: 'Wind speed (m/s).' },
];

// Export function for Tropical Cyclones (STORM)
const exportCycloneStorm: ExportFunction = async (allRecords) => {
  const filtered = filterCycloneStormRecords(allRecords);
  return buildDomainExportFile(cycloneStormBaseName, cycloneStormColumns, filtered);
};

const getCycloneStormMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: cycloneStormBaseName,
  title: 'Tropical Cyclones (STORM)',
  description:
    'STORM tropical cyclone wind speed hazard at this site across multiple return periods, scenarios and climate models.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${cycloneStormBaseName}.csv`,
      title: 'Tropical Cyclones (STORM) Data',
      description:
        'Tropical cyclone wind speed data from the STORM project for this site across return periods and scenarios.',
      format: 'csv',
      schema: {
        fields: structuredClone(cycloneStormColumns),
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: 'CC0 1.0',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  sources: [
    {
      name: 'STORM tropical cyclone wind speed return periods',
      description:
        'Tropical cyclone wind speed return periods under historical and climate change scenarios.',
      lineage:
        'Russell (2022), derived from Bloemendaal et al. (2020) STORM tropical cyclone dataset (doi:10.4121/12705164.v3) and Bloemendaal et al. (2022) climate change dataset (doi:10.4121/14510817.v3).',
      url: 'https://doi.org/10.4121/12705164.v3',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY-4.0',
      id: 'source_storm_cyclone',
    },
    {
      name: 'STORM climate change tropical cyclone wind speed return periods',
      description:
        'Tropical cyclone wind speed return periods under climate change scenarios, providing future projections of cyclone hazards.',
      lineage:
        'Bloemendaal, Nadia; de Moel, Hans; Dullaart, Job; Haarsma, R.J.; Haigh, I.D.; Martinez, Andrew B.; et al. (2022). doi:10.4121/14510817.v3',
      url: 'https://doi.org/10.4121/14510817.v3',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY-4.0',
      id: 'source_storm_cyclone_cc',
    },
  ],
});

const cycloneStormExportConfig: ExportConfig = {
  exportFunction: exportCycloneStorm,
  metadataFunction: getCycloneStormMetadata,
  readmeFunction: () => ({
    datasetDescription:
      'tropical cyclone wind speeds (Sparks and Toumi 2024; Russell 2022, derived from Bloemendaal et al 2020 and Bloemendaal et al 2022)',
    datasetSources: [
      'Bloemendaal, Nadia; de Moel, H. (Hans); Muis, S; Haigh, I.D. (Ivan); Aerts, J.C.J.H. (Jeroen) (2020): STORM tropical cyclone wind speed return periods. 4TU.ResearchData. [Dataset]. DOI: https://doi.org/10.4121/12705164.v3',
      'Bloemendaal, Nadia; de Moel, Hans; Dullaart, Job; Haarsma, R.J. (Reindert); Haigh, I.D. (Ivan); Martinez, Andrew B.; et al. (2022): STORM climate change tropical cyclone wind speed return periods. 4TU.ResearchData. [Dataset]. DOI: https://doi.org/10.4121/14510817.v3',
    ],
  }),
};

export const TropicalCyclonesStorm: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterCycloneStormRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, stormCycloneChartConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagFromReturnPeriodValuesOneThreshold(data, CYCLONE_INTENSITY_THRESHOLD),
    [data],
  );

  useRegisterExportConfig('tropical-cyclones-storm', cycloneStormExportConfig);

  return (
    <HazardAccordion title="Tropical Cyclones (STORM)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={stormCycloneChartConfig} data={data} />
    </HazardAccordion>
  );
};

// Metadata builder for RDLS metadata.json
