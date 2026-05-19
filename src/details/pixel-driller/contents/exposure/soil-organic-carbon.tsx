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

interface NatureOrganicCarbonKeys extends PixelRecordKeys {
  subtype?: string;
}

const isSoilOrganicCarbonRecord = (
  record: PixelRecord,
): record is PixelRecord<NatureOrganicCarbonKeys> =>
  record.layer.domain === 'nature' && record.layer.keys.subtype === 'organic_carbon';

const filterSoilOrganicCarbonRecords = (
  records: PixelRecord[],
): PixelRecord<NatureOrganicCarbonKeys>[] => records.filter(isSoilOrganicCarbonRecord);

const socBaseName = 'soil_organic_carbon';
const socColumns: DatapackageTableSchemaField[] = [
  {
    name: 'subtype',
    type: 'string',
    title: 'Subtype',
    description: 'Nature layer subtype (organic carbon).',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Soil organic carbon',
    description: 'Soil organic carbon stock (t/ha).',
  },
];

const exportSoilOrganicCarbon: ExportFunction = async (allRecords) => {
  const filtered = filterSoilOrganicCarbonRecords(allRecords);
  return buildDomainExportFile(socBaseName, socColumns, filtered);
};

const getSoilOrganicCarbonMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: socBaseName,
  title: 'Soil organic carbon',
  description: 'Soil organic carbon (t/ha) at this site.',
  risk_data_type: ['exposure'],
  spatial,
  resources: [
    {
      id: `${socBaseName}.csv`,
      title: 'Soil organic carbon',
      description: 'Soil organic carbon in tonnes per hectare at this site.',
      format: 'csv',
      schema: {
        fields: structuredClone(socColumns),
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
      name: 'SoilGrids 2.0',
      description:
        'Soil organic carbon content at 0-30cm, in tonnes per hectare, aggregated to a 1000m grid.',
      lineage:
        'Poggio, L., de Sousa, L.M., Batjes, N.H., Heuvelink, G.B.M., Kempen, B., Ribeiro, E., Rossiter, D. (2021). SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. SOIL 7, 217-240. doi:10.5194/soil-7-217-2021. Predictions were derived using digital soil mapping based on Quantile Random Forest, drawing on a global compilation of soil profile data and environmental layers.',
      url: 'https://soilgrids.org/',
      type: 'dataset',
      component: 'exposure',
      license: 'CC-BY 4.0',
      id: 'source_soilgrids_2_0',
    },
  ],
  attributions: [
    {
      name: 'L. Poggio',
    },
    {
      name: 'L.M. de Sousa',
    },
    {
      name: 'N.H. Batjes',
    },
    {
      name: 'G.B.M. Heuvelink',
    },
    {
      name: 'B. Kempen',
    },
    {
      name: 'E. Ribeiro',
    },
    {
      name: 'D. Rossiter',
    },
  ],
});

const soilOrganicCarbonExportConfig: ExportConfig = {
  exportFunction: exportSoilOrganicCarbon,
  metadataFunction: getSoilOrganicCarbonMetadata,
  readmeFunction: () => ({
    datasetDescription: 'soil organic carbon (t/ha)',
    datasetSources: [],
  }),
};

const formatSoilOrganicCarbon = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 3 });
  return `${n} t/ha`;
};

export const SoilOrganicCarbon: FC<HazardComponentProps> = ({ records }) => {
  const socRecords = useMemo(() => filterSoilOrganicCarbonRecords(records), [records]);

  const primaryRecord = useMemo(
    () => socRecords.find((r) => r.value != null) ?? null,
    [socRecords],
  );

  const value = primaryRecord?.value ?? null;
  const disabled = value == null;

  useRegisterExportConfig('soil-organic-carbon', soilOrganicCarbonExportConfig);

  return (
    <ExposureAccordion title="Soil Organic Carbon" disabled={disabled}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Soil organic carbon
          </Typography>
          <Typography variant="body1">{formatSoilOrganicCarbon(value)}</Typography>
        </Box>
      </Stack>
    </ExposureAccordion>
  );
};
