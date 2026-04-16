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

interface DemKeys extends PixelRecordKeys {
  derivative?: string;
}

const isDemRecord = (record: PixelRecord): record is PixelRecord<DemKeys> =>
  record.layer.domain === 'dem';

const filterDemRecords = (records: PixelRecord[]): PixelRecord<DemKeys>[] =>
  records.filter(isDemRecord);

const DERIVATIVE_ELEVATION = 'elevation';
const DERIVATIVE_SLOPE = 'slope';

const findByDerivative = (
  records: PixelRecord<DemKeys>[],
  derivative: string,
): PixelRecord<DemKeys> | undefined => records.find((r) => r.layer.keys.derivative === derivative);

const demBaseName = 'dem';
const demColumns: DatapackageTableSchemaField[] = [
  {
    name: 'derivative',
    type: 'string',
    title: 'Derivative',
    description: 'DEM derivative: elevation (m a.s.l.) or slope (degrees).',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Value',
    description:
      'Elevation in metres above sea level, or slope in degrees, depending on derivative.',
  },
];

const exportDem: ExportFunction = async (allRecords) => {
  const filtered = filterDemRecords(allRecords);
  return buildDomainExportFile(demBaseName, demColumns, filtered);
};

const getDemMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: demBaseName,
  title: 'Topography (DEM)',
  description: 'Elevation (metres above sea level) and slope (degrees) at this site.',
  risk_data_type: ['exposure'],
  spatial,
  resources: [
    {
      id: `${demBaseName}.csv`,
      title: 'Topography',
      description: 'DEM elevation and slope values at this site.',
      format: 'csv',
      schema: {
        fields: structuredClone(demColumns),
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

const demExportConfig: ExportConfig = {
  exportFunction: exportDem,
  metadataFunction: getDemMetadata,
  readmeFunction: () => ({
    datasetDescription: 'topography: elevation (m a.s.l.) and slope (°) from DEM',
    datasetSources: [],
  }),
};

const formatElevationM = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${n} m`;
};

const formatSlopeDegrees = (value: number | null): string => {
  if (value == null) return 'N/A';
  const n = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${n}°`;
};

export const Topography: FC<HazardComponentProps> = ({ records }) => {
  const demRecords = useMemo(() => filterDemRecords(records), [records]);

  const elevationRecord = useMemo(
    () => findByDerivative(demRecords, DERIVATIVE_ELEVATION),
    [demRecords],
  );
  const slopeRecord = useMemo(() => findByDerivative(demRecords, DERIVATIVE_SLOPE), [demRecords]);

  const elevationValue = elevationRecord?.value ?? null;
  const slopeValue = slopeRecord?.value ?? null;
  const disabled = elevationValue == null && slopeValue == null;

  useRegisterExportConfig('topography', demExportConfig);

  return (
    <ExposureAccordion title="Topography" disabled={disabled}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Elevation (metres above sea level)
          </Typography>
          <Typography variant="body1">{formatElevationM(elevationValue)}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Slope
          </Typography>
          <Typography variant="body1">{formatSlopeDegrees(slopeValue)}</Typography>
        </Box>
      </Stack>
    </ExposureAccordion>
  );
};
