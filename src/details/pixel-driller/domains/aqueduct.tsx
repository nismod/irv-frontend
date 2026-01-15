import _ from 'lodash';
import { FC, useMemo } from 'react';

import { toReturnPeriodRows } from '../data-transforms';
import { ExportFunction, useRegisterExportFunction } from '../download-context';
import { buildDomainExportFiles, DomainExportConfig } from '../download-generators';
import { HazardAccordion } from '../hazard-accordion';
import { RagStatus } from '../rag-indicator';
import { ReturnPeriodChart } from '../return-period-chart';
import {
  ChartConfig,
  HazardComponentProps,
  PixelRecord,
  PixelRecordKeys,
  ReturnPeriodRow,
} from '../types';

// Aqueduct-specific key type definition
export interface AqueductKeys extends PixelRecordKeys {
  hazard?: string;
  rp?: string;
  rcp?: string;
  epoch?: string;
  gcm?: string;
}

// Chart configs
const aqueductRiverConfig: ChartConfig = {
  id: 'river-aqueduct',
  title: 'River flooding – Aqueduct',
  xLabel: 'return period (years)',
  yLabel: 'Flood height (m)',
  // Aqueduct river flooding: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
};

const aqueductCoastalConfig: ChartConfig = {
  id: 'coastal-aqueduct',
  title: 'Coastal flooding – Aqueduct',
  xLabel: 'return period (years)',
  yLabel: 'Flood height (m)',
  // Coastal flooding: scenario = epoch + rcp, colour by rcp
  seriesFields: ['epoch', 'rcp'],
  colorField: 'rcp',
};

// Thresholds
// Flood height above which damages are substantial (in meters) - used for river and coastal flooding
const FLOOD_HEIGHT_THRESHOLD = 4; // TODO: Make this configurable or derive from domain knowledge

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

// Type guard for Aqueduct records
const isAqueductRecord = (record: PixelRecord): record is PixelRecord<AqueductKeys> => {
  return record.layer.domain === 'aqueduct';
};

// Filter function for Aqueduct river flooding records
const filterAqueductRiverRecords = (records: PixelRecord[]): PixelRecord<AqueductKeys>[] => {
  return records.filter(isAqueductRecord).filter((r) => r.layer.keys.hazard === 'fluvial');
};

// Filter function for Aqueduct coastal flooding records
const filterAqueductCoastalRecords = (records: PixelRecord[]): PixelRecord<AqueductKeys>[] => {
  return records.filter(isAqueductRecord).filter((r) => r.layer.keys.hazard === 'coastal');
};

const aqueductRiverExportConfig: DomainExportConfig = {
  // domain === 'aqueduct' and hazard === 'fluvial'
  baseName: 'aqueduct__fluvial',
  columns: [
    { key: 'hazard', label: 'Hazard', description: 'Hazard type (fluvial).' },
    { key: 'rp', label: 'Return period', description: 'Return period (years).' },
    { key: 'rcp', label: 'RCP', description: 'Representative Concentration Pathway scenario.' },
    { key: 'epoch', label: 'Epoch', description: 'Time period or epoch of the simulation.' },
    { key: 'gcm', label: 'GCM', description: 'Global Climate Model identifier.' },
    { key: 'value', label: 'Flood height', description: 'Flood height (m).' },
  ],
  metadata: {},
};

const aqueductCoastalExportConfig: DomainExportConfig = {
  // domain === 'aqueduct' and hazard === 'coastal'
  baseName: 'aqueduct__coastal',
  columns: [
    { key: 'hazard', label: 'Hazard', description: 'Hazard type (coastal).' },
    { key: 'rp', label: 'Return period', description: 'Return period (years).' },
    { key: 'rcp', label: 'RCP', description: 'Representative Concentration Pathway scenario.' },
    { key: 'epoch', label: 'Epoch', description: 'Time period or epoch of the simulation.' },
    { key: 'gcm', label: 'GCM', description: 'Global Climate Model identifier.' },
    { key: 'value', label: 'Flood height', description: 'Flood height (m).' },
  ],
  metadata: {},
};

// Export function for River Flooding (Aqueduct)
const exportAqueductRiver: ExportFunction = async (allRecords) => {
  const filtered = filterAqueductRiverRecords(allRecords);
  return buildDomainExportFiles(aqueductRiverExportConfig, filtered);
};

// Export function for Coastal Flooding (Aqueduct)
const exportAqueductCoastal: ExportFunction = async (allRecords) => {
  const filtered = filterAqueductCoastalRecords(allRecords);
  return buildDomainExportFiles(aqueductCoastalExportConfig, filtered);
};

export const RiverFloodingAqueduct: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterAqueductRiverRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, aqueductRiverConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo((): RagStatus => {
    if (data.length === 0) return 'no-data';
    return calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD);
  }, [data]);

  useRegisterExportFunction('river-flooding-aqueduct', exportAqueductRiver);

  return (
    <HazardAccordion title="River Flooding (Aqueduct)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={aqueductRiverConfig} data={data} />
    </HazardAccordion>
  );
};

export const CoastalFlooding: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterAqueductCoastalRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, aqueductCoastalConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo((): RagStatus => {
    if (data.length === 0) return 'no-data';
    return calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD);
  }, [data]);

  useRegisterExportFunction('coastal-flooding-aqueduct', exportAqueductCoastal);

  return (
    <HazardAccordion title="Coastal Flooding (Aqueduct)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={aqueductCoastalConfig} data={data} />
    </HazardAccordion>
  );
};
