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
import { ChartConfig, HazardComponentProps, PixelRecord, PixelRecordKeys } from '../types';

// Cyclone IRIS-specific key type definition
export interface CycloneIrisKeys extends PixelRecordKeys {
  rp?: string;
  epoch?: string;
  ssp?: string;
  gcm?: string;
}

// Chart config
const irisCycloneChartConfig: ChartConfig = {
  id: 'cyclone-iris',
  title: 'Tropical cyclones – IRIS',
  xLabel: 'Return period (years)',
  yLabel: 'Wind speed (m/s)',
  // IRIS cyclones: scenario = epoch + ssp, colour by ssp
  seriesFields: ['epoch', 'ssp'],
  colorField: 'ssp',
};

// Thresholds
// Threshold for cyclone intensity above which damages are substantial
const CYCLONE_INTENSITY_THRESHOLD = 50; // TODO: Make this configurable or derive from domain knowledge

// Type guard for Cyclone IRIS records
const isCycloneIrisRecord = (record: PixelRecord): record is PixelRecord<CycloneIrisKeys> => {
  return record.layer.domain === 'cyclone_iris';
};

// Filter function for Cyclone IRIS records
const filterCycloneIrisRecords = (records: PixelRecord[]): PixelRecord<CycloneIrisKeys>[] => {
  return records.filter(isCycloneIrisRecord);
};

const cycloneIrisBaseName = 'cyclone_iris';
const cycloneIrisColumns: DatapackageTableSchemaField[] = [
  { name: 'rp', type: 'number', title: 'Return period', description: 'Return period (years).' },
  {
    name: 'epoch',
    type: 'string',
    title: 'Epoch',
    description: 'Time period or epoch of the simulation.',
  },
  {
    name: 'ssp',
    type: 'string',
    title: 'SSP',
    description: 'Shared Socioeconomic Pathway scenario.',
  },
  { name: 'gcm', type: 'string', title: 'GCM', description: 'Global Climate Model identifier.' },
  { name: 'value', type: 'number', title: 'Wind speed', description: 'Wind speed (m/s).' },
];

// Export function for Tropical Cyclones (IRIS)
const exportCycloneIris: ExportFunction = async (allRecords) => {
  const filtered = filterCycloneIrisRecords(allRecords);
  return buildDomainExportFile(cycloneIrisBaseName, cycloneIrisColumns, filtered);
};

export const getCycloneIrisMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: cycloneIrisBaseName,
  title: 'Tropical Cyclones (IRIS)',
  description:
    'IRIS tropical cyclone wind speed hazard at this site across multiple return periods, scenarios and climate models.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${cycloneIrisBaseName}.csv`,
      title: 'Tropical Cyclones (IRIS) Data',
      description:
        'Tropical cyclone wind speed data from the IRIS project for this site across return periods and scenarios.',
      format: 'csv',
      schema: {
        fields: structuredClone(cycloneIrisColumns),
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: 'CC-BY 4.0',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  sources: [
    {
      name: 'IRIS tropical cyclone model wind speed return period maps',
      description:
        'Tropical cyclone maximum wind speeds (in m/s) generated using the IRIS tropical cyclone model. Wind speeds available from 1 in 10 to 1 in 1,000 year return periods at 1/10 degree spatial resolution. Present (2020) and future (2050) epochs, with SSP1-2.6, SSP2-4.5 and SSP5-8.5 future scenarios. Return period maps generated from an earlier version of the IRIS model event set.',
      lineage:
        'Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset. Scientific Data 11, 424 DOI 10.1038/s41597-024-03250-y and Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model. Figshare. Collection. DOI 10.6084/m9.figshare.c.6724251.v1',
      url: 'https://doi.org/10.1038/s41597-024-03250-y',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY 4.0',
      id: 'source_cyclone_iris',
    },
  ],
});

const cycloneIrisExportConfig: ExportConfig = {
  exportFunction: exportCycloneIris,
  metadataFunction: getCycloneIrisMetadata,
  readmeFunction: () => ({
    datasetDescription:
      'tropical cyclone wind speeds (Sparks and Toumi 2024; Russell 2022, derived from Bloemendaal et al 2020 and Bloemendaal et al 2022)',
    datasetSources: [
      'Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset. Scientific Data 11, 424 DOI https://doi.org/10.1038/s41597-024-03250-y',
      'Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model. Figshare. Collection. DOI https://doi.org/10.6084/m9.figshare.c.6724251.v1',
    ],
  }),
};

export const TropicalCyclonesIris: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () => toReturnPeriodRows(filterCycloneIrisRecords(records), irisCycloneChartConfig),
    [records],
  );
  const ragStatus = useMemo(
    () => calculateRagFromReturnPeriodValuesOneThreshold(data, CYCLONE_INTENSITY_THRESHOLD),
    [data],
  );
  // Calculate RAG status based on hazard data
  useRegisterExportConfig('tropical-cyclones-iris', cycloneIrisExportConfig);

  return (
    <HazardAccordion title="Tropical Cyclones (IRIS)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={irisCycloneChartConfig} data={data} />
    </HazardAccordion>
  );
};
