import Stack from '@mui/material/Stack';
import _ from 'lodash';
import { FC, useMemo } from 'react';

import { toReturnPeriodRows } from '../data-transforms';
import { RagStatus, RagStatusDisplay } from '../rag-indicator';
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
  yLabel: 'value',
  // Aqueduct river flooding: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
};

const aqueductCoastalConfig: ChartConfig = {
  id: 'coastal-aqueduct',
  title: 'Coastal flooding – Aqueduct',
  xLabel: 'return period (years)',
  yLabel: 'value',
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

export const RiverFloodingAqueduct: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(
    () => records.filter(isAqueductRecord).filter((r) => r.layer.keys.hazard === 'fluvial'),
    [records],
  );

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, aqueductRiverConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={aqueductRiverConfig} data={data} />
    </Stack>
  );
};

export const CoastalFlooding: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(
    () => records.filter(isAqueductRecord).filter((r) => r.layer.keys.hazard === 'coastal'),
    [records],
  );

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, aqueductCoastalConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={aqueductCoastalConfig} data={data} />
    </Stack>
  );
};
