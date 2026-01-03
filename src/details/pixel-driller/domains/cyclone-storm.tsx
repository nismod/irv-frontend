import Stack from '@mui/material/Stack';
import _ from 'lodash';
import { FC, useMemo } from 'react';

import { toReturnPeriodRows } from '../data-transforms';
import { RagStatus, RagStatusDisplay } from '../rag-indicator';
import { ReturnPeriodChart } from '../return-period-chart';
import { ChartConfig, HazardComponentProps, ReturnPeriodRow } from '../types';

// Chart config
const stormCycloneConfig: ChartConfig = {
  id: 'cyclone-storm',
  title: 'Tropical cyclones – STORM',
  xLabel: 'return period (years)',
  yLabel: 'value',
  // STORM cyclones: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
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

export const TropicalCyclonesStorm: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () =>
      toReturnPeriodRows(
        records.filter((r) => r.layer.domain === 'cyclone_storm'),
        stormCycloneConfig,
      ),
    [records],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, CYCLONE_INTENSITY_THRESHOLD),
    [data],
  );

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <ReturnPeriodChart config={stormCycloneConfig} data={data} />
    </Stack>
  );
};
