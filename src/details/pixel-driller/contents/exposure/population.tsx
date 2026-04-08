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
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../../download/metadata-common';
import { DatapackageTableSchemaField, RdlsDataset } from '../../download/metadata-types';
import { HazardAccordion } from '../../hazard-accordion';
import { RagStatus } from '../../rag/rag-types';
import { HazardComponentProps, PixelRecord, PixelRecordKeys } from '../../types';

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

const getPopulationMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: populationBaseName,
  title: 'Population density',
  description: 'Population density (people per km²) at this site.',
  risk_data_type: ['exposure'],
  spatial,
  resources: [
    {
      id: `${populationBaseName}.csv`,
      title: 'Population density',
      description: 'Population density in people per km² at this site for the given epoch.',
      format: 'csv',
      schema: {
        fields: structuredClone(populationColumns),
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: 'CC-BY-NC-SA',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  sources: [],
});

const populationExportConfig: ExportConfig = {
  exportFunction: exportPopulation,
  metadataFunction: getPopulationMetadata,
  readmeFunction: () => ({
    datasetDescription: 'population density (people per km²)',
    datasetSources: [],
  }),
};

const formatPopulationDensity = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${n} people/km²`;
};

export const Population: FC<HazardComponentProps> = ({ records }) => {
  const populationRecords = useMemo(() => filterPopulationRecords(records), [records]);

  const primaryRecord = useMemo(
    () => populationRecords.find((r) => r.value != null) ?? null,
    [populationRecords],
  );

  const value = primaryRecord?.value ?? null;

  /** Exposure: RAG dot is used only to signal presence of data (green) vs none (no-data). */
  const ragStatus: RagStatus = value != null ? 'green' : 'no-data';

  useRegisterExportConfig('population', populationExportConfig);

  return (
    <HazardAccordion title="Population" ragStatus={ragStatus}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Population density
          </Typography>
          <Typography variant="body1">{formatPopulationDensity(value)}</Typography>
        </Box>
      </Stack>
    </HazardAccordion>
  );
};
