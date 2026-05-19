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

const getBuildingsMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: buildingsBaseName,
  title: 'Built-up surface',
  description:
    'Built-up surface area at this site from GHS-BUILT-S R2023A, including total and non-residential built-up surface estimates derived from multitemporal satellite imagery.',
  risk_data_type: ['exposure'],
  spatial,
  resources: [
    {
      id: `${buildingsBaseName}.csv`,
      title: 'Built-up surface',
      description:
        'Built-up surface area in m² at this site for all buildings and non-residential buildings, based on GHS-BUILT-S total and non-residential built-up surface components.',
      format: 'csv',
      schema: {
        fields: structuredClone(buildingsColumns),
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
      name: 'GHS-BUILT-S - Global Human Settlement Built-up Surface Grid',
      description:
        'GHS-BUILT-S R2023A depicts built-up surface estimates between 1975 and 2030 in 5 year intervals and two functional use components: total built-up surface and non-residential built-up surface. The data is made by spatial-temporal interpolation of multi-sensor, multi-platform satellite imagery, including Landsat and Sentinel-2 composites. Built-up surface fraction is estimated at 10m resolution from Sentinel-2 image data using training data from GHS-BUILT-S2 R2020A, Facebook, Microsoft, and OpenStreetMap building delineation.',
      lineage:
        'Pesaresi M., Politis P. (2023). European Commission Joint Research Centre. doi:10.2905/9F06F36F-4B11-47EC-ABB0-4F8B7B1D72EA',
      url: 'https://human-settlement.emergency.copernicus.eu/ghs_buS2023.php',
      type: 'dataset',
      component: 'exposure',
      license: 'CC-BY-4.0',
      id: 'source_ghs_built',
    },
  ],
  attributions: [
    {
      name: 'Martino Pesaresi',
    },
    {
      name: 'Panagiotis Politis',
    },
    {
      name: 'European Commission Joint Research Centre',
      url: 'https://joint-research-centre.ec.europa.eu/',
    },
  ],
});

const buildingsExportConfig: ExportConfig = {
  exportFunction: exportBuildings,
  metadataFunction: getBuildingsMetadata,
  readmeFunction: () => ({
    datasetDescription: 'built-up surface area by subtype (m²)',
    datasetSources: [],
  }),
};

const formatBuiltUpSurfaceM2 = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${n} m²`;
};

export const Buildings: FC<HazardComponentProps> = ({ records }) => {
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
