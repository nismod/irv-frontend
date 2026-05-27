import _ from 'lodash';
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

const getCycloneStormMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(cycloneStormBaseName, spatial, cycloneStormColumns);

const cycloneStormExportConfig: ExportConfig = {
  exportFunction: exportCycloneStorm,
  metadataFunction: getCycloneStormMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(cycloneStormBaseName),
};

export const TropicalCyclonesStorm: FC<PixelComponentProps> = ({ records }) => {
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
