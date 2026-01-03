import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import { RagStatus, RagStatusDisplay } from '../rag-indicator';
import { HazardComponentProps } from '../types';

// Thresholds for extreme heat probability (0-1 range)
// Red threshold: probability above which risk is high
const EXTREME_HEAT_RED_THRESHOLD = 0.5; // 50% probability
// Amber threshold: probability above which risk is moderate
const EXTREME_HEAT_AMBER_THRESHOLD = 0.3; // 30% probability

export const ExtremeHeat: FC<HazardComponentProps> = ({ records }) => {
  // Filter for extreme heat records (probability values)
  const extremeHeatRecords = useMemo(
    () =>
      records.filter(
        (r) =>
          r.layer.domain === 'isimip' &&
          r.layer.keys.hazard === 'extreme_heat' &&
          r.layer.keys.metric === 'occurrence',
      ),
    [records],
  );

  // Aggregate all values using maximum (worst case scenario across all epochs/rcp/gcm combinations)
  const aggregatedProbability = useMemo(() => {
    const values = extremeHeatRecords.map((r) => r.value).filter((v): v is number => v != null);
    if (values.length === 0) return 0;
    return Math.max(...values);
  }, [extremeHeatRecords]);

  // Calculate RAG status based on two thresholds
  const ragStatus = useMemo((): RagStatus => {
    if (aggregatedProbability >= EXTREME_HEAT_RED_THRESHOLD) {
      return 'red';
    } else if (aggregatedProbability >= EXTREME_HEAT_AMBER_THRESHOLD) {
      return 'amber';
    } else {
      return 'green';
    }
  }, [aggregatedProbability]);

  const formatProbability = (value: number): string => {
    // Convert to percentage and format with at most one decimal place, removing trailing zeros
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  return (
    <Stack spacing={2}>
      <RagStatusDisplay status={ragStatus} />
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Maximum probability of extreme heat event (worst case across all scenarios)
        </Typography>
        <Typography variant="body1">{formatProbability(aggregatedProbability)}</Typography>
      </Box>
    </Stack>
  );
};
