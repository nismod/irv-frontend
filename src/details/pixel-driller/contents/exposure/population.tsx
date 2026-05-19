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
import { ExposureAccordion } from '../../hazard-accordion';
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
  sources: [
    {
      name: 'GHS-POP - Global Human Settlement Population Grid',
      description:
        'GHS-POP R2023A depicts the distribution of population, expressed as the number of people per cell. Residential population estimates between 1975 and 2020 in 5 year intervals and projections to 2025 and 2030 were disaggregated to grid cells, informed by the distribution, density, and classification of built-up areas mapped in the Global Human Settlement Layer.',
      lineage:
        'Schiavina M., Freire S., Carioli A., MacManus K. (2023). European Commission Joint Research Centre. doi:10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE',
      url: 'https://human-settlement.emergency.copernicus.eu/ghs_pop2023.php',
      type: 'dataset',
      component: 'exposure',
      license: 'CC-BY-4.0',
      id: 'source_ghs_pop',
    },
  ],
  attributions: [
    {
      name: 'Marcello Schiavina',
    },
    {
      name: 'Sergio Freire',
    },
    {
      name: 'Alessandra Carioli',
    },
    {
      name: 'Kytt MacManus',
    },
    {
      name: 'European Commission Joint Research Centre',
      url: 'https://joint-research-centre.ec.europa.eu/',
    },
  ],
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
