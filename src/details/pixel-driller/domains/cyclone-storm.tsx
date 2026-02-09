import _ from 'lodash';
import { FC, useMemo } from 'react';

import { toReturnPeriodRows } from '../data-transforms';
import { ExportFunction, useRegisterExportFunction } from '../download-context';
import { buildDomainExportFiles, DomainExportConfig } from '../download-generators';
import { HazardAccordion } from '../hazard-accordion';
import {
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../metadata-common';
import { RdlsDataset, RdlsLocation } from '../metadata-types';
import { RagStatus } from '../rag-indicator';
import { ReturnPeriodChart } from '../return-period-chart';
import {
  ChartConfig,
  HazardComponentProps,
  PixelRecord,
  PixelRecordKeys,
  ReturnPeriodRow,
} from '../types';

// Cyclone STORM-specific key type definition
export interface CycloneStormKeys extends PixelRecordKeys {
  rp?: string;
  epoch?: string;
  rcp?: string;
  gcm?: string;
}

// Chart config
const stormCycloneConfig: ChartConfig = {
  id: 'cyclone-storm',
  title: 'Tropical cyclones – STORM',
  xLabel: 'Return period (years)',
  yLabel: 'Wind speed (m/s)',
  // STORM cyclones: scenario = epoch + rcp + gcm, colour by rcp
  seriesFields: ['epoch', 'rcp', 'gcm'],
  colorField: 'rcp',
};

// Thresholds
// Threshold for cyclone intensity above which damages are substantial
const CYCLONE_INTENSITY_THRESHOLD = 50; // TODO: Make this configurable or derive from domain knowledge

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

// Type guard for Cyclone STORM records
const isCycloneStormRecord = (record: PixelRecord): record is PixelRecord<CycloneStormKeys> => {
  return record.layer.domain === 'cyclone_storm';
};

// Filter function for Cyclone STORM records
const filterCycloneStormRecords = (records: PixelRecord[]): PixelRecord<CycloneStormKeys>[] => {
  return records.filter(isCycloneStormRecord);
};

const cycloneStormExportConfig: DomainExportConfig = {
  // domain === 'cyclone_storm' (no additional key filters)
  baseName: 'cyclone_storm',
  columns: [
    { key: 'rp', label: 'Return period', description: 'Return period (years).' },
    { key: 'epoch', label: 'Epoch', description: 'Time period or epoch of the simulation.' },
    { key: 'rcp', label: 'RCP', description: 'Representative Concentration Pathway scenario.' },
    { key: 'gcm', label: 'GCM', description: 'Global Climate Model identifier.' },
    { key: 'value', label: 'Wind speed', description: 'Wind speed (m/s).' },
  ],
  metadata: {},
};

// Export function for Tropical Cyclones (STORM)
const exportCycloneStorm: ExportFunction = async (allRecords) => {
  const filtered = filterCycloneStormRecords(allRecords);
  return buildDomainExportFiles(cycloneStormExportConfig, filtered);
};

export const TropicalCyclonesStorm: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterCycloneStormRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, stormCycloneConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo((): RagStatus => {
    if (data.length === 0) return 'no-data';
    return calculateRagStatusFromReturnPeriods(data, CYCLONE_INTENSITY_THRESHOLD);
  }, [data]);

  useRegisterExportFunction('tropical-cyclones-storm', exportCycloneStorm);

  return (
    <HazardAccordion title="Tropical Cyclones (STORM)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={stormCycloneConfig} data={data} />
    </HazardAccordion>
  );
};

// Metadata builder for RDLS metadata.json

export const getCycloneStormMetadata = (spatial: RdlsLocation): RdlsDataset => ({
  id: 'cyclone_storm',
  title: 'Tropical Cyclones (STORM)',
  description:
    'STORM tropical cyclone wind speed hazard at this site across multiple return periods, scenarios and climate models.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: 'cyclone_storm.csv',
      title: 'Tropical Cyclones (STORM) Data',
      description:
        'Tropical cyclone wind speed data from the STORM project for this site across return periods and scenarios.',
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
            name: 'epoch',
            type: 'string',
            title: 'Epoch',
            description: 'Time period or epoch of the simulation.',
          },
          {
            name: 'rcp',
            type: 'string',
            title: 'RCP',
            description: 'Representative Concentration Pathway scenario.',
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
            title: 'Wind speed',
            description: 'Wind speed (m/s).',
          },
        ],
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: '',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  attributions: [],
});
