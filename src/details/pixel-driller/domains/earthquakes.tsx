import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../download/download-context';
import { buildDomainExportFile } from '../download/download-generators';
import {
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../download/metadata-common';
import { DatapackageTableSchemaField, RdlsDataset } from '../download/metadata-types';
import { HazardAccordion } from '../hazard-accordion';
import { calculateRagFromSingleValueTwoThresholds } from '../rag/rag-calculation';
import { RagStatus } from '../rag/rag-types';
import { HazardComponentProps, PixelRecord, PixelRecordKeys } from '../types';

// Earthquake-specific key type definition
interface EarthquakeKeys extends PixelRecordKeys {
  rp?: string;
  medium?: string;
}

// Thresholds for earthquake ground shaking (placeholder values).
// These should be revisited and calibrated with domain experts.
const EARTHQUAKE_RED_THRESHOLD = 0.3;
const EARTHQUAKE_AMBER_THRESHOLD = 0.15;

const isEarthquakeRecord = (record: PixelRecord): record is PixelRecord<EarthquakeKeys> =>
  record.layer.domain === 'earthquake';

// Filter function for Earthquake records
const filterEarthquakeRecords = (records: PixelRecord[]): PixelRecord<EarthquakeKeys>[] => {
  return records.filter(isEarthquakeRecord);
};

const earthquakeBaseName = 'earthquake';
const earthquakeColumns: DatapackageTableSchemaField[] = [
  { name: 'rp', type: 'number', title: 'Return period', description: 'Return period (years).' },
  { name: 'medium', type: 'string', title: 'Medium', description: 'Ground medium (e.g., rock).' },
  {
    name: 'value',
    type: 'number',
    title: 'Ground shaking',
    description: 'Ground shaking intensity (model units).',
  },
];

// Export function for Earthquakes
const exportEarthquakes: ExportFunction = async (allRecords) => {
  const filtered = filterEarthquakeRecords(allRecords);
  return buildDomainExportFile(earthquakeBaseName, earthquakeColumns, filtered);
};

const getEarthquakesMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: earthquakeBaseName,
  title: 'Earthquake Ground Shaking',
  description:
    'Modelled ground shaking intensity for earthquake scenarios at this site for a given return period and medium.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${earthquakeBaseName}.csv`,
      title: 'Earthquake Ground Shaking Data',
      description:
        'Ground shaking intensity values for earthquake scenarios at this site, including return period and ground medium.',
      format: 'csv',
      schema: {
        fields: structuredClone(earthquakeColumns),
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
      name: 'GEM Global Earthquake Hazard Map',
      description:
        'The Global Earthquake Model (GEM) Global Seismic Hazard Map (version 2023.1) depicts the geographic distribution of the Peak Ground Acceleration (PGA) with a 10% probability of being exceeded in 50 years, computed for reference rock conditions (shear wave velocity, VS30, of 760-800 m/s).',
      lineage:
        'Pagani M, Garcia-Pelaez J, Gee R, Johnson K, Silva V, Simionato M, Styron R, Vigano D, Danciu L, Monelli D, Poggi V, Weatherill G. (2019). The 2018 version of the Global Earthquake Model: Hazard component. Earthquake Spectra, 36(1), DOI: 10.1177/8755293020931866. and Johnson, K., Villani, M., Bayliss, K., Brooks, C., Chandrasekhar, S., Chartier, T., Chen, Y.-S., Garcia-Pelaez, J., Gee, R., Styron, R., Rood, A., Simionato, M., & Pagani, M. (2023). Global Seismic Hazard Map (v2023.1.0) [Data set]. Zenodo. DOI 10.5281/zenodo.8409647',
      url: 'https://doi.org/10.5281/zenodo.8409647',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY-NC-SA 4.0',
      id: 'source_gem_earthquake',
    },
  ],
});

const earthquakesExportConfig: ExportConfig = {
  exportFunction: exportEarthquakes,
  metadataFunction: getEarthquakesMetadata,
};

export const Earthquakes: FC<HazardComponentProps> = ({ records }) => {
  const earthquakeRecords = useMemo(() => filterEarthquakeRecords(records), [records]);

  // There should effectively be a single value per location.
  // Pick the first non-null value if multiple records exist.
  const primaryRecord = useMemo(
    () => earthquakeRecords.find((r) => r.value != null) ?? null,
    [earthquakeRecords],
  );

  const value = (primaryRecord?.value as number | null) ?? null;

  const ragStatus = useMemo(
    () =>
      calculateRagFromSingleValueTwoThresholds(
        value,
        EARTHQUAKE_RED_THRESHOLD,
        EARTHQUAKE_AMBER_THRESHOLD,
      ),
    [value],
  );

  const formatValue = (v: number | null): string =>
    v == null ? 'N/A' : v.toFixed(3).replace(/\.?0+$/, '');

  const rpLabel = primaryRecord?.layer.keys.rp ?? '475';
  const mediumLabel = primaryRecord?.layer.keys.medium ?? 'rock';

  useRegisterExportConfig('earthquakes', earthquakesExportConfig);

  return (
    <HazardAccordion title="Earthquakes" ragStatus={ragStatus}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ground shaking (return period {rpLabel} years, medium: {mediumLabel})
          </Typography>
          <Typography variant="body1">{formatValue(value)}</Typography>
        </Box>
      </Stack>
    </HazardAccordion>
  );
};
