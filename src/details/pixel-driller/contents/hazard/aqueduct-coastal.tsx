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

// Aqueduct-specific key type definition
export interface AqueductKeys extends PixelRecordKeys {
  hazard: string;
  rp: string;
  rcp: string;
  epoch: string;
  gcm: string;
}

// Chart configs
const aqueductCoastalChartConfig: ChartConfig = {
  id: 'coastal-aqueduct',
  title: 'Coastal flooding – Aqueduct',
  xLabel: 'Return period (years)',
  yLabel: 'Flood depth (m)',
  // Coastal flooding: scenario = epoch + rcp, colour by rcp
  seriesFields: ['epoch', 'rcp'],
  colorField: 'rcp',
};

// Thresholds above which damages are substantial (in meters)
const FLOOD_HEIGHT_THRESHOLD = 0.3;
// based on UK note - flood waters at any velocity with depth >= 0.3m pose risks to some
// https://assets.publishing.service.gov.uk/media/602d04a98fa8f5037d371a08/FLOOD_HAZARD_RATINGS_AND_THRESHOLDS_explanatory_note.pdf

// Type guard for Aqueduct records
const isAqueductRecord = (record: PixelRecord): record is PixelRecord<AqueductKeys> => {
  return record.layer.domain === 'aqueduct';
};

// Filter function for Aqueduct coastal flooding records
const filterAqueductCoastalRecords = (records: PixelRecord[]): PixelRecord<AqueductKeys>[] => {
  return records.filter(isAqueductRecord).filter((r) => r.layer.keys.hazard === 'coastal');
};

const aqueductCoastalBaseName = 'aqueduct__coastal';

const aqueductCoastalColumns: DatapackageTableSchemaField[] = [
  {
    name: 'rp',
    type: 'number',
    title: 'Return period',
    description: 'Return period (years).',
  },
  {
    name: 'rcp',
    type: 'string',
    title: 'RCP',
    description: 'Representative Concentration Pathway (Climate Scenario).',
  },
  {
    name: 'epoch',
    type: 'string',
    title: 'Epoch',
    description: 'Time period or epoch.',
  },
  {
    name: 'gcm',
    type: 'string',
    title: 'GCM',
    description: 'Global Climate Model.',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Flood depth',
    description: 'Flood depth (m).',
  },
];

// Export function for Coastal Flooding (Aqueduct)
const exportAqueductCoastal: ExportFunction = async (allRecords) => {
  const filtered = filterAqueductCoastalRecords(allRecords);
  return buildDomainExportFile(aqueductCoastalBaseName, aqueductCoastalColumns, filtered);
};

export const getAqueductCoastalMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(aqueductCoastalBaseName, spatial, aqueductCoastalColumns);

const aqueductCoastalExportConfig: ExportConfig = {
  exportFunction: exportAqueductCoastal,
  metadataFunction: getAqueductCoastalMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(aqueductCoastalBaseName),
};

export const CoastalFlooding: FC<PixelComponentProps> = ({ records }) => {
  const data = useMemo(
    () => toReturnPeriodRows(filterAqueductCoastalRecords(records), aqueductCoastalChartConfig),
    [records],
  );

  const ragStatus = useMemo(
    () => calculateRagFromReturnPeriodValuesOneThreshold(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  useRegisterExportConfig('coastal-flooding-aqueduct', aqueductCoastalExportConfig);

  return (
    <HazardAccordion title="Coastal Flooding (Aqueduct)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={aqueductCoastalChartConfig} data={data} />
    </HazardAccordion>
  );
};
