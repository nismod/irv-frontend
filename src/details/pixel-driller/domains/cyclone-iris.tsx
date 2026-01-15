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

// Cyclone IRIS-specific key type definition
export interface CycloneIrisKeys extends PixelRecordKeys {
  rp?: string;
  epoch?: string;
  ssp?: string;
  gcm?: string;
}

// Chart config
const irisCycloneConfig: ChartConfig = {
  id: 'cyclone-iris',
  title: 'Tropical cyclones – IRIS',
  xLabel: 'return period (years)',
  yLabel: 'Wind speed (m/s)',
  // IRIS cyclones: scenario = epoch + ssp, colour by ssp
  seriesFields: ['epoch', 'ssp'],
  colorField: 'ssp',
};

// Thresholds
// Threshold for cyclone intensity above which damages are substantial
const CYCLONE_INTENSITY_THRESHOLD = 50; // TODO: Make this configurable or derive from domain knowledge

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

// Type guard for Cyclone IRIS records
const isCycloneIrisRecord = (record: PixelRecord): record is PixelRecord<CycloneIrisKeys> => {
  return record.layer.domain === 'cyclone_iris';
};

// Filter function for Cyclone IRIS records
const filterCycloneIrisRecords = (records: PixelRecord[]): PixelRecord<CycloneIrisKeys>[] => {
  return records.filter(isCycloneIrisRecord);
};

const cycloneIrisExportConfig: DomainExportConfig = {
  // domain === 'cyclone_iris' (no additional key filters)
  baseName: 'cyclone_iris',
  columns: [
    { key: 'rp', label: 'Return period', description: 'Return period (years).' },
    { key: 'epoch', label: 'Epoch', description: 'Time period or epoch of the simulation.' },
    { key: 'ssp', label: 'SSP', description: 'Shared Socioeconomic Pathway scenario.' },
    { key: 'gcm', label: 'GCM', description: 'Global Climate Model identifier.' },
    { key: 'value', label: 'Wind speed', description: 'Wind speed (m/s).' },
  ],
  metadata: {},
};

// Export function for Tropical Cyclones (IRIS)
const exportCycloneIris: ExportFunction = async (allRecords) => {
  const filtered = filterCycloneIrisRecords(allRecords);
  return buildDomainExportFiles(cycloneIrisExportConfig, filtered);
};

export const TropicalCyclonesIris: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterCycloneIrisRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, irisCycloneConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo((): RagStatus => {
    if (data.length === 0) return 'no-data';
    return calculateRagStatusFromReturnPeriods(data, CYCLONE_INTENSITY_THRESHOLD);
  }, [data]);

  useRegisterExportFunction('tropical-cyclones-iris', exportCycloneIris);

  return (
    <HazardAccordion title="Tropical Cyclones (IRIS)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={irisCycloneConfig} data={data} />
    </HazardAccordion>
  );
};
