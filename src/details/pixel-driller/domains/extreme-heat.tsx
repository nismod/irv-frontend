import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../download-context';
import { buildDomainExportFiles } from '../download-generators';
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
    description: 'Event probability (0–1) for extreme heat occurrence.',
  },
];

// Export function for Extreme Heat
const exportExtremeHeat: ExportFunction = async (allRecords) => {
  const filtered = filterExtremeHeatRecords(allRecords);
  return buildDomainExportFiles(extremeHeatBaseName, extremeHeatColumns, filtered);
};

const getExtremeHeatMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: extremeHeatBaseName,
  title: 'Extreme Heat Occurrence (ISIMIP)',
  description:
    'Probability of extreme heat events at this site across multiple emissions scenarios, epochs and climate models.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${extremeHeatBaseName}.csv`,
      title: 'Extreme Heat Occurrence Data (ISIMIP)',
      description:
        'Extreme heat occurrence probabilities from the ISIMIP project for this site across scenarios.',
      format: 'csv',
      schema: {
        fields: structuredClone(extremeHeatColumns),
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: 'CC0 1.0',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  sources: [
    {
      name: 'Annual probability of extreme heat and drought events',
      description:
        'Derived dataset of extreme heat and drought event probabilities based on climate projections.',
      lineage:
        "Russell, T., Nicholas, C., & Bernhofen, M. (2023), derived from Lange et al. (2020) climate impact event projections from Earth's Future.",
      url: 'https://doi.org/10.5281/zenodo.8147088',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY-4.0',
      id: 'source_extreme_heat_drought',
    },
  ],
});

const extremeHeatExportConfig: ExportConfig = {
  exportFunction: exportExtremeHeat,
  metadataFunction: getExtremeHeatMetadata,
};

export const ExtremeHeat: FC<HazardComponentProps> = ({ records }) => {
  // Filter for extreme heat records (probability values)
  const extremeHeatRecords = useMemo(() => filterExtremeHeatRecords(records), [records]);

  // Aggregate all values using maximum (worst case scenario across all epochs/rcp/gcm combinations)
  const aggregatedProbability = useMemo(() => {
    const values = extremeHeatRecords.map((r) => r.value).filter((v): v is number => v != null);
    if (values.length === 0) return 0;
    return Math.max(...values);
  }, [extremeHeatRecords]);

  // Calculate RAG status based on two thresholds
  const ragStatus = useMemo((): RagStatus => {
    if (extremeHeatRecords.length === 0) return 'no-data';
    if (aggregatedProbability >= EXTREME_HEAT_RED_THRESHOLD) {
      return 'red';
    } else if (aggregatedProbability >= EXTREME_HEAT_AMBER_THRESHOLD) {
      return 'amber';
    } else {
      return 'green';
    }
  }, [aggregatedProbability, extremeHeatRecords.length]);

  const formatProbability = (value: number): string => {
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
