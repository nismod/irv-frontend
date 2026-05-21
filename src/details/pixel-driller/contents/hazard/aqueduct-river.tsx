import { FC, useMemo } from 'react';

import { ReturnPeriodChart } from '../../charts/return-period-chart';
import { toReturnPeriodRows } from '../../data-transforms';
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
import { HazardAccordion } from '../../hazard-accordion';
import { calculateRagFromReturnPeriodValuesOneThreshold } from '../../rag/rag-calculation';
import { ChartConfig, PixelComponentProps, PixelRecord, PixelRecordKeys } from '../../types';

// Aqueduct-specific key type definition
export interface AqueductKeys extends PixelRecordKeys {
  hazard: string;
  rp: string;
  rcp: string;
  epoch: string;
  gcm: string;
}

// Chart configs
const aqueductRiverChartConfig: ChartConfig = {
  id: 'river-aqueduct',
  title: 'River flooding – Aqueduct',
  xLabel: 'Return period (years)',
  yLabel: 'Flood height (m)',
  // Aqueduct river flooding: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
};

// Thresholds
// Flood height above which damages are substantial (in meters)
const FLOOD_HEIGHT_THRESHOLD = 0.3;
// based on UK note - flood waters at any velocity with depth >= 0.3m pose risks to some
// https://assets.publishing.service.gov.uk/media/602d04a98fa8f5037d371a08/FLOOD_HAZARD_RATINGS_AND_THRESHOLDS_explanatory_note.pdf

// Type guard for Aqueduct records
const isAqueductRecord = (record: PixelRecord): record is PixelRecord<AqueductKeys> => {
  return record.layer.domain === 'aqueduct';
};

// Filter function for Aqueduct river flooding records
const filterAqueductRiverRecords = (records: PixelRecord[]): PixelRecord<AqueductKeys>[] => {
  return records.filter(isAqueductRecord).filter((r) => r.layer.keys.hazard === 'fluvial');
};

const aqueductRiverBaseName = 'aqueduct__fluvial';

const aqueductRiverColumns: DatapackageTableSchemaField[] = [
  {
    name: 'rp',
    type: 'number',
    title: 'Return period',
    description: 'Return period (years).',
  },
  {
    name: 'rcp',
    type: 'string',
    title: 'RCP',
    description: 'Representative Concentration Pathway scenario.',
  },
  {
    name: 'epoch',
    type: 'string',
    title: 'Epoch',
    description: 'Time period or epoch of the simulation.',
  },
  {
    name: 'gcm',
    type: 'string',
    title: 'GCM',
    description: 'Global Climate Model identifier.',
  },
  {
    name: 'value',
    type: 'number',
    title: 'Flood height',
    description: 'Flood height (m).',
  },
];

// Export function for River Flooding (Aqueduct)
const exportAqueductRiver: ExportFunction = async (allRecords) => {
  const filtered = filterAqueductRiverRecords(allRecords);
  return buildDomainExportFile(aqueductRiverBaseName, aqueductRiverColumns, filtered);
};

export const getAqueductRiverMetadata = ({ spatial }: MetadataArgs): RdlsDataset =>
  buildPixelDrillerMetadata(aqueductRiverBaseName, {
    spatial,
    resources: [
      {
        id: `${aqueductRiverBaseName}.csv`,
        title: 'Aqueduct River Flood Risk Data',
        description:
          'River flood height data from the Aqueduct project, representing fluvial inundation depth in meters at this site across return periods, emissions scenarios, and current and future epochs.',
        format: 'csv',
        schema: {
          fields: structuredClone(aqueductRiverColumns),
        },
        dialect: COMMON_DIALECT,
      },
    ],
  });

const aqueductRiverExportConfig: ExportConfig = {
  exportFunction: exportAqueductRiver,
  metadataFunction: getAqueductRiverMetadata,
  readmeFunction: () => getPixelDrillerReadmeContents(aqueductRiverBaseName),
};

export const RiverFloodingAqueduct: FC<PixelComponentProps> = ({ records }) => {
  const data = useMemo(
    () => toReturnPeriodRows(filterAqueductRiverRecords(records), aqueductRiverChartConfig),
    [records],
  );

  const ragStatus = useMemo(
    () => calculateRagFromReturnPeriodValuesOneThreshold(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  useRegisterExportConfig('river-flooding-aqueduct', aqueductRiverExportConfig);

  return (
    <HazardAccordion title="River Flooding (Aqueduct)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={aqueductRiverChartConfig} data={data} />
    </HazardAccordion>
  );
};
