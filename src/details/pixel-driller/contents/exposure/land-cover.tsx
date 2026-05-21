import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import { getLandCoverCategoryName } from '@/config/land-cover/land-cover-category-labels';

import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../../download/download-context';
import { buildDomainExportFile } from '../../download/download-generators';
import { COMMON_DIALECT } from '../../download/metadata-common';
import {
  buildPixelDrillerMetadata,
  getPixelDrillerReadmeContents,
} from '../../download/metadata-from-config';
import { DatapackageTableSchemaField, RdlsDataset } from '../../download/metadata-types';
import { ExposureAccordion } from '../../hazard-accordion';
import { PixelComponentProps, PixelRecord, PixelRecordKeys } from '../../types';

interface LandCoverKeys extends PixelRecordKeys {}

const isLandCoverRecord = (record: PixelRecord): record is PixelRecord<LandCoverKeys> =>
  record.layer.domain === 'land_cover';

const filterLandCoverRecords = (records: PixelRecord[]): PixelRecord<LandCoverKeys>[] =>
  records.filter(isLandCoverRecord);

const landCoverBaseName = 'land_cover';
const landCoverColumns: DatapackageTableSchemaField[] = [
  {
    name: 'value',
    type: 'number',
    title: 'Land cover class',
    description: 'Categorical land cover class code (ESA CCI–style; see project legend).',
  },
];

const exportLandCover: ExportFunction = async (allRecords) => {
  const filtered = filterLandCoverRecords(allRecords);
  return buildDomainExportFile(landCoverBaseName, landCoverColumns, filtered);
};

const getLandCoverMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(landCoverBaseName, {
    spatial,
    resources: [
      {
        id: `${landCoverBaseName}.csv`,
        title: 'Land cover',
        description:
          'Land cover class code at this site, using the ESA CCI land cover classification values shown in the map legend.',
        format: 'csv',
        schema: {
          fields: structuredClone(landCoverColumns),
        },
        dialect: COMMON_DIALECT,
      },
    ],
  });

const landCoverExportConfig: ExportConfig = {
  exportFunction: exportLandCover,
  metadataFunction: getLandCoverMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(landCoverBaseName),
};

function classCodeFromValue(value: number | null): number | null {
  if (value == null) return null;
  return Math.round(value);
}

export const LandCover: FC<PixelComponentProps> = ({ records }) => {
  const landCoverRecords = useMemo(() => filterLandCoverRecords(records), [records]);

  const primaryRecord = useMemo(
    () => landCoverRecords.find((r) => r.value != null) ?? null,
    [landCoverRecords],
  );

  const classCode = classCodeFromValue(primaryRecord?.value ?? null);

  const displayLabel = useMemo(() => {
    if (classCode == null) return 'N/A';
    return getLandCoverCategoryName(classCode) ?? `Unknown class (${classCode})`;
  }, [classCode]);
  const disabled = classCode == null;

  useRegisterExportConfig('land-cover', landCoverExportConfig);

  return (
    <ExposureAccordion title="Land Cover" disabled={disabled}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Category
          </Typography>
          <Typography variant="body1">{displayLabel}</Typography>
        </Box>
      </Stack>
    </ExposureAccordion>
  );
};
