import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import { ExportFunction, useRegisterExportFunction } from '../download-context';
import { buildDomainExportFiles, DomainExportConfig } from '../download-generators';
import { HazardAccordion } from '../hazard-accordion';
import {
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../metadata-common';
import { RdlsDataset, RdlsLocation } from '../metadata-types';
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

// Filter function for drought records
const filterDroughtRecords = (records: PixelRecord[]): PixelRecord<DroughtKeys>[] => {
  return records
    .filter(isIsimipRecordForDrought)
    .filter((r) => r.layer.keys.hazard === 'drought' && r.layer.keys.metric === 'occurrence');
};

// Export configuration for drought occurrence (ISIMIP)
const droughtExportConfig: DomainExportConfig = {
  baseName: 'isimip__drought__occurrence',
  columns: [
    {
      key: 'rcp',
      label: 'RCP',
      description: 'Representative Concentration Pathway (emissions scenario).',
    },
    {
      key: 'epoch',
      label: 'Epoch',
      description: 'Time period or epoch of the simulation.',
    },
    {
      key: 'gcm',
      label: 'GCM',
      description: 'Global Climate Model identifier.',
    },
    {
      key: 'value',
      label: 'Probability',
      description: 'Event probability (0–1) for drought occurrence.',
    },
  ],
  // Stub metadata for now; to be replaced with a richer catalog format later.
  metadata: {},
};

// Export function for Droughts
const exportDroughts: ExportFunction = async (allRecords) => {
  const filtered = filterDroughtRecords(allRecords);
  // Always return CSV + JSON, even if there are no records
  return buildDomainExportFiles(droughtExportConfig, filtered);
};

export const Droughts: FC<HazardComponentProps> = ({ records }) => {
  // Filter for drought records (probability values)
  const droughtRecords = useMemo(() => filterDroughtRecords(records), [records]);

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

  useRegisterExportFunction('droughts', exportDroughts);

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

// Metadata builder for RDLS metadata.json

export const getDroughtsMetadata = (spatial: RdlsLocation): RdlsDataset => ({
  id: 'isimip__drought__occurrence',
  title: 'Drought Occurrence (ISIMIP)',
  description:
    'Probability of drought occurrence at this site across multiple emissions scenarios, epochs and climate models.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: 'isimip__drought__occurrence.csv',
      title: 'Drought Occurrence Data (ISIMIP)',
      description:
        'Drought occurrence probabilities from the ISIMIP project for this site across scenarios.',
      format: 'csv',
      schema: {
        fields: [
          {
            name: 'rcp',
            type: 'string',
            title: 'RCP',
            description: 'Representative Concentration Pathway (emissions scenario).',
          },
          {
            name: 'epoch',
            type: 'string',
            title: 'Epoch',
            description: 'Time period or epoch of the simulation.',
          },
          {
            name: 'gcm',
            type: 'string',
            title: 'GCM',
            description: 'Global Climate Model identifier.',
          },
          {
            name: 'value',
            type: 'number',
            title: 'Probability',
            description: 'Event probability (0–1) for drought occurrence.',
          },
        ],
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
