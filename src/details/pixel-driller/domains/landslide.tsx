import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import { ExportFunction, useRegisterExportFunction } from '../download-context';
import { buildDomainExportFiles, DomainExportConfig } from '../download-generators';
import { HazardAccordion } from '../hazard-accordion';
import { RagStatus } from '../rag-indicator';
import { HazardComponentProps, PixelRecord, PixelRecordKeys } from '../types';

// Landslide-specific key type definition
export interface LandslideKeys extends PixelRecordKeys {
  subtype?: string;
}

// Map numeric susceptibility values to categories
const SUSCEPTIBILITY_CATEGORIES: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
};

// Type guard for Landslide records
const isLandslideRecord = (record: PixelRecord): record is PixelRecord<LandslideKeys> => {
  return record.layer.domain === 'landslide';
};

// Filter function for Landslide records
const filterLandslideRecords = (records: PixelRecord[]): PixelRecord<LandslideKeys>[] => {
  return records.filter(isLandslideRecord);
};

const landslideExportConfig: DomainExportConfig = {
  // domain === 'landslide' (subtypes handled as data, not filters)
  baseName: 'landslide',
  columns: [
    {
      key: 'subtype',
      label: 'Subtype',
      description: 'Hazard subtype (earthquake, rainfall_mean, rainfall_median, susceptibility).',
    },
    {
      key: 'value',
      label: 'Value',
      description: 'Modelled probability or susceptibility value (0–1).',
    },
  ],
  metadata: {},
};

// Export function for Landslide
const exportLandslide: ExportFunction = async (allRecords) => {
  const filtered = filterLandslideRecords(allRecords);
  return buildDomainExportFiles(landslideExportConfig, filtered);
};

export const Landslides: FC<HazardComponentProps> = ({ records }) => {
  const landslideRecords = useMemo(() => filterLandslideRecords(records), [records]);

  // Extract values for each subtype (treat null as zero for numeric values)
  const earthquakeProb = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'earthquake');
    return record?.value == null ? 0 : (record.value as number);
  }, [landslideRecords]);

  const rainfallMeanProb = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'rainfall_mean');
    return record?.value == null ? 0 : (record.value as number);
  }, [landslideRecords]);

  const rainfallMedianProb = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'rainfall_median');
    return record?.value == null ? 0 : (record.value as number);
  }, [landslideRecords]);

  const susceptibilityValue = useMemo(() => {
    const record = landslideRecords.find((r) => r.layer.keys.subtype === 'susceptibility');
    return record?.value ?? null;
  }, [landslideRecords]);

  const susceptibilityCategory = useMemo(() => {
    if (susceptibilityValue == null) return null;
    const numValue =
      typeof susceptibilityValue === 'number' ? susceptibilityValue : Number(susceptibilityValue);
    return SUSCEPTIBILITY_CATEGORIES[numValue] ?? `Unknown (${susceptibilityValue})`;
  }, [susceptibilityValue]);

  // Calculate RAG status from susceptibility
  const ragStatus = useMemo((): RagStatus => {
    if (landslideRecords.length === 0 || susceptibilityValue == null) return 'no-data';

    const numValue =
      typeof susceptibilityValue === 'number' ? susceptibilityValue : Number(susceptibilityValue);
    return SUSCEPTIBILITY_CATEGORIES[numValue] === 'Very Low' ? 'green' : 'red';
  }, [susceptibilityValue, landslideRecords.length]);

  const formatProbability = (value: number): string => {
    // Convert to percentage and format with at most one decimal place, removing trailing zeros
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  useRegisterExportFunction('landslide', exportLandslide);

  return (
    <HazardAccordion title="Landslide" ragStatus={ragStatus}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Annual probability (earthquake trigger)
          </Typography>
          <Typography variant="body1">{formatProbability(earthquakeProb)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Annual probability (rainfall - mean)
          </Typography>
          <Typography variant="body1">{formatProbability(rainfallMeanProb)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Annual probability (rainfall - median)
          </Typography>
          <Typography variant="body1">{formatProbability(rainfallMedianProb)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Susceptibility
          </Typography>
          <Typography variant="body1">{susceptibilityCategory ?? 'N/A'}</Typography>
        </Box>
      </Stack>
    </HazardAccordion>
  );
};
