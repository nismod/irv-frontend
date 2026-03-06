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

// Filter function for Cooling Degree Days records
const filterCddRecords = (records: PixelRecord[]): PixelRecord<CddKeys>[] => {
  return records.filter(isCddRecord);
};

const cddBaseName = 'cdd_miranda';
const cddColumns: DatapackageTableSchemaField[] = [
  {
    name: 'metric',
    type: 'string',
    title: 'Metric',
    description: 'Type of cooling degree days change (absolute or relative).',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Value',
    description: 'Change in cooling degree days (absolute) or fraction (relative).',
  },
];

// Export function for Cooling Degree Days
const exportCoolingDegreeDays: ExportFunction = async (allRecords) => {
  const filtered = filterCddRecords(allRecords);
  return buildDomainExportFiles(cddBaseName, cddColumns, filtered);
};

export const getCoolingDegreeDaysMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: cddBaseName,
  title: 'Cooling Degree Days',
  description:
    'Change in cooling degree days at this site, expressed as absolute and relative metrics.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${cddBaseName}.csv`,
      title: 'Cooling Degree Days Data',
      description:
        'Cooling degree days change data for this site, including absolute and relative metrics.',
      format: 'csv',
      schema: {
        fields: structuredClone(cddColumns),
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

const coolingDegreeDaysExportConfig: ExportConfig = {
  exportFunction: exportCoolingDegreeDays,
  metadataFunction: getCoolingDegreeDaysMetadata,
};

export const CoolingDegreeDays: FC<HazardComponentProps> = ({ records }) => {
  const cddRecords = useMemo(() => filterCddRecords(records), [records]);

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

  useRegisterExportConfig('cooling-degree-days', coolingDegreeDaysExportConfig);

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
