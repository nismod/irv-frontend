import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import { HazardAccordion } from '../hazard-accordion';
import { RagStatus } from '../rag-indicator';
import { HazardComponentProps, PixelRecord, PixelRecordKeys } from '../types';

// Cooling degree days-specific key type definition
interface CddKeys extends PixelRecordKeys {
  metric?: string; // 'absolute' | 'relative'
}

// Thresholds for cooling degree days changes.
// NOTE: These are provisional and should be refined based on domain expertise.
const ABSOLUTE_AMBER_THRESHOLD = 50; // e.g. +50 degree-days
const ABSOLUTE_RED_THRESHOLD = 100; // e.g. +100 degree-days

const RELATIVE_AMBER_THRESHOLD = 0.25; // e.g. +25%
const RELATIVE_RED_THRESHOLD = 0.5; // e.g. +50%

const isCddRecord = (record: PixelRecord): record is PixelRecord<CddKeys> =>
  record.layer.domain === 'cdd_miranda';

export const CoolingDegreeDays: FC<HazardComponentProps> = ({ records }) => {
  const cddRecords = useMemo(() => records.filter(isCddRecord), [records]);

  const absoluteRecord = useMemo(
    () => cddRecords.find((r) => r.layer.keys.metric === 'absolute') ?? null,
    [cddRecords],
  );

  const relativeRecord = useMemo(
    () => cddRecords.find((r) => r.layer.keys.metric === 'relative') ?? null,
    [cddRecords],
  );

  const absoluteValue = absoluteRecord?.value ?? null;
  const relativeValue = relativeRecord?.value ?? null;

  const ragStatus = useMemo<RagStatus>(() => {
    if (cddRecords.length === 0) return 'no-data';

    const abs = typeof absoluteValue === 'number' ? absoluteValue : 0;
    const rel = typeof relativeValue === 'number' ? relativeValue : 0;

    const crossesRed = abs >= ABSOLUTE_RED_THRESHOLD || rel >= RELATIVE_RED_THRESHOLD;
    if (crossesRed) return 'red';

    const crossesAmber = abs >= ABSOLUTE_AMBER_THRESHOLD || rel >= RELATIVE_AMBER_THRESHOLD;
    if (crossesAmber) return 'amber';

    return 'green';
  }, [cddRecords.length, absoluteValue, relativeValue]);

  const formatAbsolute = (value: number | null): string =>
    value == null ? 'N/A' : value.toFixed(1).replace(/\.?0+$/, '');

  const formatRelative = (value: number | null): string => {
    if (value == null) return 'N/A';
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  return (
    <HazardAccordion title="Cooling Degree Days" ragStatus={ragStatus}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Absolute change in cooling degree days
          </Typography>
          <Typography variant="body1">
            {formatAbsolute(typeof absoluteValue === 'number' ? absoluteValue : null)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Relative change in cooling degree days
          </Typography>
          <Typography variant="body1">
            {formatRelative(typeof relativeValue === 'number' ? relativeValue : null)}
          </Typography>
        </Box>
      </Stack>
    </HazardAccordion>
  );
};
