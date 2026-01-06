import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import { HazardAccordion } from '../hazard-accordion';
import { RagStatus } from '../rag-indicator';
import { HazardComponentProps, PixelRecord, PixelRecordKeys } from '../types';

// Drought-specific key type definition
interface DroughtKeys extends PixelRecordKeys {
  hazard?: string;
  metric?: string;
  rcp?: string;
  epoch?: string;
  gcm?: string;
}

// Thresholds for drought probability (0-1 range).
// NOTE: Provisional values; should be refined with domain expertise.
const DROUGHT_RED_THRESHOLD = 0.5; // 50% probability
const DROUGHT_AMBER_THRESHOLD = 0.3; // 30% probability

// Type guard for ISIMIP records (used for drought filtering)
const isIsimipRecordForDrought = (record: PixelRecord): record is PixelRecord<DroughtKeys> =>
  record.layer.domain === 'isimip';

export const Droughts: FC<HazardComponentProps> = ({ records }) => {
  // Filter for drought records (probability values)
  const droughtRecords = useMemo(
    () =>
      records
        .filter(isIsimipRecordForDrought)
        .filter((r) => r.layer.keys.hazard === 'drought' && r.layer.keys.metric === 'occurrence'),
    [records],
  );

  // Aggregate all values using maximum (worst case scenario across all epochs/rcp/gcm combinations)
  const aggregatedProbability = useMemo(() => {
    const values = droughtRecords.map((r) => r.value).filter((v): v is number => v != null);
    if (values.length === 0) return 0;
    return Math.max(...values);
  }, [droughtRecords]);

  // Calculate RAG status based on two thresholds (same logic pattern as Extreme Heat)
  const ragStatus = useMemo((): RagStatus => {
    if (droughtRecords.length === 0) return 'no-data';
    if (aggregatedProbability >= DROUGHT_RED_THRESHOLD) {
      return 'red';
    } else if (aggregatedProbability >= DROUGHT_AMBER_THRESHOLD) {
      return 'amber';
    } else {
      return 'green';
    }
  }, [aggregatedProbability, droughtRecords.length]);

  const formatProbability = (value: number): string => {
    // Convert to percentage and format with at most one decimal place, removing trailing zeros
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  return (
    <HazardAccordion title="Droughts" ragStatus={ragStatus}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Maximum probability of drought event (worst case across all scenarios)
        </Typography>
        <Typography variant="body1">{formatProbability(aggregatedProbability)}</Typography>
      </Box>
    </HazardAccordion>
  );
};
