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

const getSoilOrganicCarbonMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(socBaseName, spatial, socColumns);

const soilOrganicCarbonExportConfig: ExportConfig = {
  exportFunction: exportSoilOrganicCarbon,
  metadataFunction: getSoilOrganicCarbonMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(socBaseName),
};

const formatSoilOrganicCarbon = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 3 });
  return `${n} t/ha`;
};

export const SoilOrganicCarbon: FC<PixelComponentProps> = ({ records }) => {
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
