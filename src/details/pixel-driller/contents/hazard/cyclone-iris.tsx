import { FC, useMemo } from 'react';

import { ReturnPeriodChart } from '../../charts/return-period-chart';
import { toReturnPeriodRows } from '../../data-transforms';
import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../../download/download-context';
import { buildDomainExportFile } from '../../download/download-generators';
import {
  buildPixelDrillerMetadata,
  getPixelDrillerReadmeContents,
} from '../../download/metadata-from-config';
import { DatapackageTableSchemaField, RdlsDataset } from '../../download/metadata-types';
import { HazardAccordion } from '../../hazard-accordion';
import { calculateRagFromReturnPeriodValuesOneThreshold } from '../../rag/rag-calculation';
import { ChartConfig, PixelComponentProps, PixelRecord, PixelRecordKeys } from '../../types';

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
  title: 'Tropical cyclones (IRIS)',
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
    description: 'Time period or epoch.',
  },
  {
    name: 'ssp',
    type: 'string',
    title: 'SSP',
    description: 'Shared Socioeconomic Pathway scenario.',
  },
  { name: 'gcm', type: 'string', title: 'GCM', description: 'Global Climate Model.' },
  { name: 'value', type: 'number', title: 'Wind speed', description: 'Wind speed (m/s).' },
];

// Export function for Tropical Cyclones (IRIS)
const exportCycloneIris: ExportFunction = async (allRecords) => {
  const filtered = filterCycloneIrisRecords(allRecords);
  return buildDomainExportFile(cycloneIrisBaseName, cycloneIrisColumns, filtered);
};

export const getCycloneIrisMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(cycloneIrisBaseName, spatial, cycloneIrisColumns);

const cycloneIrisExportConfig: ExportConfig = {
  exportFunction: exportCycloneIris,
  metadataFunction: getCycloneIrisMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(cycloneIrisBaseName),
};

export const TropicalCyclonesIris: FC<PixelComponentProps> = ({ records }) => {
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
