import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../../download/download-context';
import { buildDomainExportFile } from '../../download/download-generators';
import {
  buildPixelDrillerMetadata,
  getPixelDrillerReadmeContents,
} from '../../download/metadata-from-config';
import { DatapackageTableSchemaField, RdlsDataset } from '../../download/metadata-types';
import { HazardAccordion } from '../../hazard-accordion';
import { calculateRagFromSingleValueTwoThresholds } from '../../rag/rag-calculation';
import { RagStatus } from '../../rag/rag-types';
import { PixelComponentProps, PixelRecord, PixelRecordKeys } from '../../types';

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

const droughtBaseName = 'isimip__drought__occurrence';
const droughtColumns: DatapackageTableSchemaField[] = [
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
];

// Export function for Droughts
const exportDroughts: ExportFunction = async (allRecords) => {
  const filtered = filterDroughtRecords(allRecords);
  return buildDomainExportFile(droughtBaseName, droughtColumns, filtered);
};

const getDroughtsMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(droughtBaseName, spatial, droughtColumns);

const droughtsExportConfig: ExportConfig = {
  exportFunction: exportDroughts,
  metadataFunction: getDroughtsMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(droughtBaseName),
};

export const Droughts: FC<PixelComponentProps> = ({ records }) => {
  // Filter for drought records (probability values)
  const droughtRecords = useMemo(() => filterDroughtRecords(records), [records]);

  // Aggregate all values using maximum (worst case scenario across all epochs/rcp/gcm combinations)
  // Returns null if there are no numeric values at all.
  const aggregatedProbability = useMemo(() => {
    const values = droughtRecords.map((r) => r.value).filter((v): v is number => v != null);
    if (values.length === 0) return null;
    return Math.max(...values);
  }, [droughtRecords]);

  // Calculate RAG status based on two thresholds using the shared helper.
  const ragStatus = useMemo<RagStatus>(
    () =>
      calculateRagFromSingleValueTwoThresholds(
        aggregatedProbability,
        DROUGHT_RED_THRESHOLD,
        DROUGHT_AMBER_THRESHOLD,
      ),
    [aggregatedProbability],
  );

  const formatProbability = (value: number | null): string => {
    if (value == null) return 'N/A';
    // Convert to percentage and format with at most one decimal place, removing trailing zeros
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  useRegisterExportConfig('droughts', droughtsExportConfig);

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
