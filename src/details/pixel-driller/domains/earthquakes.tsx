import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import { HazardAccordion } from '../hazard-accordion';
import { RagStatus } from '../rag-indicator';
import { HazardComponentProps, PixelRecord, PixelRecordKeys } from '../types';

// Earthquake-specific key type definition
interface EarthquakeKeys extends PixelRecordKeys {
  rp?: string;
  medium?: string;
}

// Thresholds for earthquake ground shaking (placeholder values).
// These should be revisited and calibrated with domain experts.
const EARTHQUAKE_RED_THRESHOLD = 0.3;
const EARTHQUAKE_AMBER_THRESHOLD = 0.15;

const isEarthquakeRecord = (record: PixelRecord): record is PixelRecord<EarthquakeKeys> =>
  record.layer.domain === 'earthquake';

export const Earthquakes: FC<HazardComponentProps> = ({ records }) => {
  const earthquakeRecords = useMemo(() => records.filter(isEarthquakeRecord), [records]);

  // There should effectively be a single value per location.
  // Pick the first non-null value if multiple records exist.
  const primaryRecord = useMemo(
    () => earthquakeRecords.find((r) => r.value != null) ?? null,
    [earthquakeRecords],
  );

  const value = (primaryRecord?.value as number | null) ?? null;

  const ragStatus = useMemo<RagStatus>(() => {
    if (earthquakeRecords.length === 0 || value == null) return 'no-data';

    if (value >= EARTHQUAKE_RED_THRESHOLD) return 'red';
    if (value >= EARTHQUAKE_AMBER_THRESHOLD) return 'amber';
    return 'green';
  }, [earthquakeRecords.length, value]);

  const formatValue = (v: number | null): string =>
    v == null ? 'N/A' : v.toFixed(3).replace(/\.?0+$/, '');

  const rpLabel = primaryRecord?.layer.keys.rp ?? '475';
  const mediumLabel = primaryRecord?.layer.keys.medium ?? 'rock';

  return (
    <HazardAccordion title="Earthquakes" ragStatus={ragStatus}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ground shaking (return period {rpLabel} years, medium: {mediumLabel})
          </Typography>
          <Typography variant="body1">{formatValue(value)}</Typography>
        </Box>
      </Stack>
    </HazardAccordion>
  );
};
