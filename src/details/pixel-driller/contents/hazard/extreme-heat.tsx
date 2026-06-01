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

// Extreme Heat-specific key type definition
export interface ExtremeHeatKeys extends PixelRecordKeys {
  hazard?: string;
  metric?: string;
  rcp?: string;
  epoch?: string;
  gcm?: string;
}

// Thresholds for extreme heat probability (0-1 range)
// Red threshold: probability above which risk is high
const EXTREME_HEAT_RED_THRESHOLD = 0.5; // 50% probability
// Amber threshold: probability above which risk is moderate
const EXTREME_HEAT_AMBER_THRESHOLD = 0.3; // 30% probability

// Type guard for ISIMIP records (used for Extreme Heat filtering)
const isIsimipRecordForExtremeHeat = (
  record: PixelRecord,
): record is PixelRecord<ExtremeHeatKeys> => {
  return record.layer.domain === 'isimip';
};

// Filter function for extreme heat records
const filterExtremeHeatRecords = (records: PixelRecord[]): PixelRecord<ExtremeHeatKeys>[] => {
  return records
    .filter(isIsimipRecordForExtremeHeat)
    .filter((r) => r.layer.keys.hazard === 'extreme_heat' && r.layer.keys.metric === 'occurrence');
};

const extremeHeatBaseName = 'isimip__extreme_heat__occurrence';
const extremeHeatColumns: DatapackageTableSchemaField[] = [
  {
    name: 'rcp',
    type: 'string',
    title: 'RCP',
    description: 'Representative Concentration Pathway (Climate Scenario).',
  },
  {
    name: 'epoch',
    type: 'string',
    title: 'Epoch',
    description: 'Time period or epoch.',
  },
  {
    name: 'gcm',
    type: 'string',
    title: 'GCM',
    description: 'Global Climate Model.',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Probability',
    description: 'Probability of extreme heat occurrence.',
  },
];

// Export function for Extreme Heat
const exportExtremeHeat: ExportFunction = async (allRecords) => {
  const filtered = filterExtremeHeatRecords(allRecords);
  return buildDomainExportFile(extremeHeatBaseName, extremeHeatColumns, filtered);
};

const getExtremeHeatMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(extremeHeatBaseName, spatial, extremeHeatColumns);

const extremeHeatExportConfig: ExportConfig = {
  exportFunction: exportExtremeHeat,
  metadataFunction: getExtremeHeatMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(extremeHeatBaseName),
};

export const ExtremeHeat: FC<PixelComponentProps> = ({ records }) => {
  // Filter for extreme heat records (probability values)
  const extremeHeatRecords = useMemo(() => filterExtremeHeatRecords(records), [records]);

  // Aggregate all values using maximum (worst case scenario across all epochs/rcp/gcm combinations)
  // Returns null if there are no numeric values at all.
  const aggregatedProbability = useMemo(() => {
    const values = extremeHeatRecords.map((r) => r.value).filter((v): v is number => v != null);
    if (values.length === 0) return null;
    return Math.max(...values);
  }, [extremeHeatRecords]);

  // Calculate RAG status based on two thresholds using the shared helper.
  const ragStatus = useMemo<RagStatus>(
    () =>
      calculateRagFromSingleValueTwoThresholds(
        aggregatedProbability,
        EXTREME_HEAT_RED_THRESHOLD,
        EXTREME_HEAT_AMBER_THRESHOLD,
      ),
    [aggregatedProbability],
  );

  const formatProbability = (value: number | null): string => {
    if (value == null) return 'N/A';
    // Convert to percentage and format with at most one decimal place, removing trailing zeros
    const percentage = value * 100;
    return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`;
  };

  useRegisterExportConfig('extreme-heat', extremeHeatExportConfig);

  return (
    <HazardAccordion title="Extreme Heat" ragStatus={ragStatus}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Maximum probability of extreme heat event (worst case across all scenarios)
        </Typography>
        <Typography variant="body1">{formatProbability(aggregatedProbability)}</Typography>
      </Box>
    </HazardAccordion>
  );
};
