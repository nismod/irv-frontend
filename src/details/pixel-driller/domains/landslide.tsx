import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../download-context';
import { buildDomainExportFile } from '../download-generators';
import { HazardAccordion } from '../hazard-accordion';
import {
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../metadata-common';
import { DatapackageTableSchemaField, RdlsDataset } from '../metadata-types';
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

const landslideBaseName = 'landslide';
const landslideColumns: DatapackageTableSchemaField[] = [
  {
    name: 'subtype',
    type: 'string',
    title: 'Subtype',
    description: 'Hazard subtype (earthquake, rainfall_mean, rainfall_median, susceptibility).',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Value',
    description: 'Modelled probability or susceptibility value (0–1).',
  },
];

// Export function for Landslide
const exportLandslide: ExportFunction = async (allRecords) => {
  const filtered = filterLandslideRecords(allRecords);
  return buildDomainExportFile(landslideBaseName, landslideColumns, filtered);
};

export const getLandslidesMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: landslideBaseName,
  title: 'Landslide Susceptibility and Probabilities',
  description:
    'Landslide susceptibility and annual probabilities for different triggers at this site.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${landslideBaseName}.csv`,
      title: 'Landslide Data',
      description:
        'Landslide susceptibility and annual probabilities for earthquake and rainfall triggers at this site.',
      format: 'csv',
      schema: {
        fields: structuredClone(landslideColumns),
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: '',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  attributions: [],
});

const landslideExportConfig: ExportConfig = {
  exportFunction: exportLandslide,
  metadataFunction: getLandslidesMetadata,
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

  useRegisterExportConfig('landslide', landslideExportConfig);

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
