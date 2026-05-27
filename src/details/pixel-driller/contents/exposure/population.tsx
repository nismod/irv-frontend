import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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
import { ExposureAccordion } from '../../hazard-accordion';
import { PixelComponentProps, PixelRecord, PixelRecordKeys } from '../../types';

interface PopulationKeys extends PixelRecordKeys {
  epoch?: string;
}

const isPopulationRecord = (record: PixelRecord): record is PixelRecord<PopulationKeys> =>
  record.layer.domain === 'population';

const filterPopulationRecords = (records: PixelRecord[]): PixelRecord<PopulationKeys>[] =>
  records.filter(isPopulationRecord);

const populationBaseName = 'population';
const populationColumns: DatapackageTableSchemaField[] = [
  {
    name: 'epoch',
    type: 'string',
    title: 'Epoch',
    description: 'Reference year or epoch for the population density estimate.',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Population density',
    description: 'Population density (people per km²).',
  },
];

const exportPopulation: ExportFunction = async (allRecords) => {
  const filtered = filterPopulationRecords(allRecords);
  return buildDomainExportFile(populationBaseName, populationColumns, filtered);
};

const getPopulationMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(populationBaseName, spatial, populationColumns);

const populationExportConfig: ExportConfig = {
  exportFunction: exportPopulation,
  metadataFunction: getPopulationMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(populationBaseName),
};

const formatPopulationDensity = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${n} people/km²`;
};

export const Population: FC<PixelComponentProps> = ({ records }) => {
  const populationRecords = useMemo(() => filterPopulationRecords(records), [records]);

  const primaryRecord = useMemo(
    () => populationRecords.find((r) => r.value != null) ?? null,
    [populationRecords],
  );

  const value = primaryRecord?.value ?? null;
  const disabled = value == null;

  useRegisterExportConfig('population', populationExportConfig);

  return (
    <ExposureAccordion title="Population" disabled={disabled}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Population density
          </Typography>
          <Typography variant="body1">{formatPopulationDensity(value)}</Typography>
        </Box>
      </Stack>
    </ExposureAccordion>
  );
};
