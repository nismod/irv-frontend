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
import { RagStatus } from '../../rag/rag-types';
import {
  ChartConfig,
  PixelComponentProps,
  PixelRecord,
  PixelRecordKeys,
  ReturnPeriodRow,
} from '../../types';

// JRC Flood-specific key type definition
export interface JrcFloodKeys extends PixelRecordKeys {
  rp?: string;
}

// Chart config
const jrcFloodConfig: ChartConfig = {
  id: 'river-jrc',
  title: 'River flooding – JRC',
  xLabel: 'return period (years)',
  yLabel: 'Flood height (m)',
  // JRC flood only has rp in the mock data, so just plot a single line
  seriesFields: [],
};

// Thresholds
// Flood height above which damages are substantial (in meters)
const FLOOD_HEIGHT_THRESHOLD = 0.3;
// based on UK note - flood waters at any velocity with depth >= 0.3m pose risks to some
// https://assets.publishing.service.gov.uk/media/602d04a98fa8f5037d371a08/FLOOD_HAZARD_RATINGS_AND_THRESHOLDS_explanatory_note.pdf

// Helper function to calculate RAG status based on return period data
// Uses maximum values (worst case) for RP 10 and RP 100 against a threshold
const calculateRagStatusFromReturnPeriods = (
  data: ReturnPeriodRow[],
  threshold: number,
): RagStatus => {
  // Group by return period and take maximum value (worst case scenario)
  const groupedByRp = _.groupBy(data, (d) => d.rp);

  // Get maximum value for RP 10 (1 in 10 years)
  const rp10Data = groupedByRp[10] || [];
  const maxRp10 = rp10Data.length > 0 ? Math.max(...rp10Data.map((d) => d.value)) : 0;

  // Get maximum value for RP 100 (1 in 100 years)
  const rp100Data = groupedByRp[100] || [];
  const maxRp100 = rp100Data.length > 0 ? Math.max(...rp100Data.map((d) => d.value)) : 0;

  // Apply threshold logic
  if (maxRp10 > threshold) {
    return 'red';
  } else if (maxRp100 > threshold) {
    return 'amber';
  } else {
    return 'green';
  }
};

// Type guard for JRC Flood records
const isJrcFloodRecord = (record: PixelRecord): record is PixelRecord<JrcFloodKeys> => {
  return record.layer.domain === 'jrc_flood';
};

// Filter function for JRC Flood records
const filterJrcFloodRecords = (records: PixelRecord[]): PixelRecord<JrcFloodKeys>[] => {
  return records.filter(isJrcFloodRecord);
};

const jrcFloodBaseName = 'jrc_flood';
const jrcFloodColumns: DatapackageTableSchemaField[] = [
  { name: 'rp', type: 'number', title: 'Return period', description: 'Return period (years).' },
  { name: 'value', type: 'number', title: 'Flood height', description: 'Flood height (m).' },
];

// Export function for JRC Flood
const exportJrcFlood: ExportFunction = async (allRecords) => {
  const filtered = filterJrcFloodRecords(allRecords);
  return buildDomainExportFile(jrcFloodBaseName, jrcFloodColumns, filtered);
};

export const getJrcFloodMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(jrcFloodBaseName, spatial, jrcFloodColumns);

const jrcFloodExportConfig: ExportConfig = {
  exportFunction: exportJrcFlood,
  metadataFunction: getJrcFloodMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(jrcFloodBaseName),
};

export const RiverFloodingJrc: FC<PixelComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterJrcFloodRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, jrcFloodConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo((): RagStatus => {
    if (data.length === 0) return 'no-data';
    return calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD);
  }, [data]);

  useRegisterExportConfig('river-flooding-jrc', jrcFloodExportConfig);

  return (
    <HazardAccordion title="River Flooding (JRC)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={jrcFloodConfig} data={data} />
    </HazardAccordion>
  );
};
