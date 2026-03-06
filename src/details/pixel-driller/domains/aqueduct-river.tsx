import _ from 'lodash';
import { FC, useMemo } from 'react';

import { toReturnPeriodRows } from '../data-transforms';
import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../download-context';
import { buildDomainExportFiles } from '../download-generators';
import { HazardAccordion } from '../hazard-accordion';
import {
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../metadata-common';
import {
  DatapackageTableSchema,
  DatapackageTableSchemaField,
  RdlsDataset,
} from '../metadata-types';
import { RagStatus } from '../rag-indicator';
import { ReturnPeriodChart } from '../return-period-chart';
import {
  ChartConfig,
  HazardComponentProps,
  PixelRecord,
  PixelRecordKeys,
  ReturnPeriodRow,
} from '../types';

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
// Flood height above which damages are substantial (in meters) - used for river and coastal flooding
const FLOOD_HEIGHT_THRESHOLD = 4; // TODO: Make this configurable or derive from domain knowledge

// Helper function to calculate RAG status based on return period data
// Uses maximum values (worst case) for RP 10 and RP 100 against a threshold
const calculateRagStatusFromReturnPeriods = (
  data: ReturnPeriodRow[],
  threshold: number,
): RagStatus => {
  if (data.length === 0) {
    return 'no-data';
  }

  // Group by return period and take maximum value (worst case scenario)
  const groupedByRp = _.groupBy(data, (d) => d.rp);

  // Get maximum value for RP 10 (1 in 10 years)
  const rp10Data = groupedByRp[10] || [];
  const maxRp10 = rp10Data.length > 0 ? Math.max(...rp10Data.map((d) => d.value)) : 0;

  // Get maximum value for RP 100 (1 in 100 years)
  const rp100Data = groupedByRp[100] || [];
  const maxRp100 = rp100Data.length > 0 ? Math.max(...rp100Data.map((d) => d.value)) : 0;

  // Apply threshold logic
  if (maxRp10 > threshold) {
    return 'red';
  } else if (maxRp100 > threshold) {
    return 'amber';
  } else {
    return 'green';
  }
};

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

const aqueductRiverDatapackageTableSchema: DatapackageTableSchema = {
  fields: aqueductRiverColumns,
};

// Export function for River Flooding (Aqueduct)
const exportAqueductRiver: ExportFunction = async (allRecords) => {
  const filtered = filterAqueductRiverRecords(allRecords);
  return buildDomainExportFiles(aqueductRiverBaseName, aqueductRiverColumns, filtered);
};

export const getAqueductRiverMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: 'aqueduct__fluvial',
  title: 'Aqueduct River Flood Risk',
  description:
    'River flood risk at this site as modelled by the Aqueduct project, including flood heights for multiple return periods and scenarios.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: 'aqueduct__fluvial.csv',
      title: 'Aqueduct River Flood Risk Data',
      description:
        'River flood height data from the Aqueduct project, representing fluvial flood depths for this site across scenarios.',
      format: 'csv',
      schema: {
        fields: [
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
        ],
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: 'CC-BY 4.0',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  sources: [
    {
      name: 'Aqueduct Floods',
      description:
        'Global riverine and coastal flood hazard maps including historical and future climate scenarios with multiple return periods.',
      lineage:
        'Ward, P.J., et al. (2020). Developed by World Resources Institute. Provides flood inundation depths for coastal and river flooding at global scale.',
      url: 'https://www.wri.org/publication/aqueduct-floods-methodology',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY-4.0',
      id: 'source_aqueduct_floods',
    },
  ],
});

const aqueductRiverExportConfig: ExportConfig = {
  exportFunction: exportAqueductRiver,
  metadataFunction: getAqueductRiverMetadata,
};

export const RiverFloodingAqueduct: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () => toReturnPeriodRows(filterAqueductRiverRecords(records), aqueductRiverChartConfig),
    [records],
  );

  const ragStatus = useMemo(
    () => calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  useRegisterExportConfig('river-flooding-aqueduct', aqueductRiverExportConfig);

  return (
    <HazardAccordion title="River Flooding (Aqueduct)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={aqueductRiverChartConfig} data={data} />
    </HazardAccordion>
  );
};
