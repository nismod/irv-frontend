import _ from 'lodash';
import { FC, useMemo } from 'react';

import { ReturnPeriodChart } from '../charts/return-period-chart';
import { toReturnPeriodRows } from '../data-transforms';
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
import { RagStatus } from '../rag/rag-types';
import {
  ChartConfig,
  HazardComponentProps,
  PixelRecord,
  PixelRecordKeys,
  ReturnPeriodRow,
} from '../types';

// JRC Flood-specific key type definition
export interface JrcFloodKeys extends PixelRecordKeys {
  rp?: string;
}

// Chart config
const jrcFloodConfig: ChartConfig = {
  id: 'river-jrc',
  title: 'River flooding – JRC',
  xLabel: 'return period (years)',
  yLabel: 'Flood height (m)',
  // JRC flood only has rp in the mock data, so just plot a single line
  seriesFields: [],
};

// Thresholds
// Flood height above which damages are substantial (in meters)
const FLOOD_HEIGHT_THRESHOLD = 4; // TODO: Make this configurable or derive from domain knowledge

// Helper function to calculate RAG status based on return period data
// Uses maximum values (worst case) for RP 10 and RP 100 against a threshold
const calculateRagStatusFromReturnPeriods = (
  data: ReturnPeriodRow[],
  threshold: number,
): RagStatus => {
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

// Type guard for JRC Flood records
const isJrcFloodRecord = (record: PixelRecord): record is PixelRecord<JrcFloodKeys> => {
  return record.layer.domain === 'jrc_flood';
};

// Filter function for JRC Flood records
const filterJrcFloodRecords = (records: PixelRecord[]): PixelRecord<JrcFloodKeys>[] => {
  return records.filter(isJrcFloodRecord);
};

const jrcFloodBaseName = 'jrc_flood';
const jrcFloodColumns: DatapackageTableSchemaField[] = [
  { name: 'rp', type: 'number', title: 'Return period', description: 'Return period (years).' },
  { name: 'value', type: 'number', title: 'Flood height', description: 'Flood height (m).' },
];

// Export function for JRC Flood
const exportJrcFlood: ExportFunction = async (allRecords) => {
  const filtered = filterJrcFloodRecords(allRecords);
  return buildDomainExportFile(jrcFloodBaseName, jrcFloodColumns, filtered);
};

export const getJrcFloodMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: jrcFloodBaseName,
  title: 'River Flooding (JRC)',
  description:
    'River flood height hazard at this site from the JRC dataset across multiple return periods.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${jrcFloodBaseName}.csv`,
      title: 'River Flooding (JRC) Data',
      description:
        'River flood height data from the JRC dataset for this site across return periods.',
      format: 'csv',
      schema: {
        fields: structuredClone(jrcFloodColumns),
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
      name: 'JRC Global River Flood Hazard Maps',
      description:
        'The global river flood hazard maps are a gridded data set representing inundation along the river network, for seven different flood return periods (from 1-in-10-years to 1-in-500-years). The input river flow data for the new maps are produced by means of the open-source hydrological model LISFLOOD, while inundation simulations are performed with the hydrodynamic model LISFLOOD-FP. The extent comprises the entire world with the exception of Greenland and Antarctica and small islands with river basins smaller than 500km². Cell values indicate water depth (in m). The maps can be used to assess the exposure of population and economic assets to river floods, and to perform flood risk assessments. The dataset is created as part of the Copernicus Emergency Management Service. NOTE: this dataset is not an official flood hazard map (for details and limitations please refer to related publications).',
      lineage:
        "Baugh, Calum; Colonese, Juan; D'Angelo, Claudia; Dottori, Francesco; Neal, Jeffrey; Prudhomme, Christel; Salamon, Peter (2024): Global river flood hazard maps. European Commission, Joint Research Centre (JRC) [Dataset] Available online at:data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif.",
      url: 'http://data.europa.eu/89h/jrc-floods-floodmapgl_rp50y-tif',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY-4.0',
      id: 'source_jrc_floods',
    },
  ],
});

const jrcFloodExportConfig: ExportConfig = {
  exportFunction: exportJrcFlood,
  metadataFunction: getJrcFloodMetadata,
};

export const RiverFloodingJrc: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterJrcFloodRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, jrcFloodConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo((): RagStatus => {
    if (data.length === 0) return 'no-data';
    return calculateRagStatusFromReturnPeriods(data, FLOOD_HEIGHT_THRESHOLD);
  }, [data]);

  useRegisterExportConfig('river-flooding-jrc', jrcFloodExportConfig);

  return (
    <HazardAccordion title="River Flooding (JRC)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={jrcFloodConfig} data={data} />
    </HazardAccordion>
  );
};
