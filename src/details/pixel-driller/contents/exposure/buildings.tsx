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

interface BuildingKeys extends PixelRecordKeys {
  subtype?: string;
}

const isBuildingRecord = (record: PixelRecord): record is PixelRecord<BuildingKeys> =>
  record.layer.domain === 'buildings';

const filterBuildingRecords = (records: PixelRecord[]): PixelRecord<BuildingKeys>[] =>
  records.filter(isBuildingRecord);

const SUBTYPE_ALL = 'all';
const SUBTYPE_NON_RESIDENTIAL = 'non_residential';

const findBySubtype = (
  records: PixelRecord<BuildingKeys>[],
  subtype: string,
): PixelRecord<BuildingKeys> | undefined => records.find((r) => r.layer.keys.subtype === subtype);

const buildingsBaseName = 'buildings';
const buildingsColumns: DatapackageTableSchemaField[] = [
  {
    name: 'subtype',
    type: 'string',
    title: 'Subtype',
    description: 'Building subset (e.g. all buildings vs non-residential only).',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Built-up surface',
    description: 'Built-up surface area (m²).',
  },
];

const exportBuildings: ExportFunction = async (allRecords) => {
  const filtered = filterBuildingRecords(allRecords);
  return buildDomainExportFile(buildingsBaseName, buildingsColumns, filtered);
};

const getBuildingsMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(buildingsBaseName, spatial, buildingsColumns);

const buildingsExportConfig: ExportConfig = {
  exportFunction: exportBuildings,
  metadataFunction: getBuildingsMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(buildingsBaseName),
};

const formatBuiltUpSurfaceM2 = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${n} m²`;
};

export const Buildings: FC<PixelComponentProps> = ({ records }) => {
  const buildingRecords = useMemo(() => filterBuildingRecords(records), [records]);

  const allRecord = useMemo(() => findBySubtype(buildingRecords, SUBTYPE_ALL), [buildingRecords]);
  const nonResidentialRecord = useMemo(
    () => findBySubtype(buildingRecords, SUBTYPE_NON_RESIDENTIAL),
    [buildingRecords],
  );

  const allValue = allRecord?.value ?? null;
  const nonResidentialValue = nonResidentialRecord?.value ?? null;
  const disabled = allValue == null && nonResidentialValue == null;

  useRegisterExportConfig('buildings', buildingsExportConfig);

  return (
    <ExposureAccordion title="Buildings" disabled={disabled}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Built-up surface — all buildings
          </Typography>
          <Typography variant="body1">{formatBuiltUpSurfaceM2(allValue)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Built-up surface — non-residential
          </Typography>
          <Typography variant="body1">{formatBuiltUpSurfaceM2(nonResidentialValue)}</Typography>
        </Box>
      </Stack>
    </ExposureAccordion>
  );
};
