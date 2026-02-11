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

// Cyclone IRIS-specific key type definition
export interface CycloneIrisKeys extends PixelRecordKeys {
  rp?: string;
  epoch?: string;
  ssp?: string;
  gcm?: string;
}

// Chart config
const irisCycloneConfig: ChartConfig = {
  id: 'cyclone-iris',
  title: 'Tropical cyclones – IRIS',
  xLabel: 'Return period (years)',
  yLabel: 'Wind speed (m/s)',
  // IRIS cyclones: scenario = epoch + ssp, colour by ssp
  seriesFields: ['epoch', 'ssp'],
  colorField: 'ssp',
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

// Type guard for Cyclone IRIS records
const isCycloneIrisRecord = (record: PixelRecord): record is PixelRecord<CycloneIrisKeys> => {
  return record.layer.domain === 'cyclone_iris';
};

// Filter function for Cyclone IRIS records
const filterCycloneIrisRecords = (records: PixelRecord[]): PixelRecord<CycloneIrisKeys>[] => {
  return records.filter(isCycloneIrisRecord);
};

const cycloneIrisExportConfig: DomainExportConfig = {
  // domain === 'cyclone_iris' (no additional key filters)
  baseName: 'cyclone_iris',
  columns: [
    { key: 'rp', label: 'Return period', description: 'Return period (years).' },
    { key: 'epoch', label: 'Epoch', description: 'Time period or epoch of the simulation.' },
    { key: 'ssp', label: 'SSP', description: 'Shared Socioeconomic Pathway scenario.' },
    { key: 'gcm', label: 'GCM', description: 'Global Climate Model identifier.' },
    { key: 'value', label: 'Wind speed', description: 'Wind speed (m/s).' },
  ],
  metadata: {},
};

// Export function for Tropical Cyclones (IRIS)
const exportCycloneIris: ExportFunction = async (allRecords) => {
  const filtered = filterCycloneIrisRecords(allRecords);
  return buildDomainExportFiles(cycloneIrisExportConfig, filtered);
};

export const TropicalCyclonesIris: FC<HazardComponentProps> = ({ records }) => {
  const filteredRecords = useMemo(() => filterCycloneIrisRecords(records), [records]);

  const data = useMemo(
    () => toReturnPeriodRows(filteredRecords, irisCycloneConfig),
    [filteredRecords],
  );

  // Calculate RAG status based on hazard data
  const ragStatus = useMemo((): RagStatus => {
    if (data.length === 0) return 'no-data';
    return calculateRagStatusFromReturnPeriods(data, CYCLONE_INTENSITY_THRESHOLD);
  }, [data]);

  useRegisterExportFunction('tropical-cyclones-iris', exportCycloneIris);

  return (
    <HazardAccordion title="Tropical Cyclones (IRIS)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={irisCycloneConfig} data={data} />
    </HazardAccordion>
  );
};

// Metadata builder for RDLS metadata.json

export const getCycloneIrisMetadata = (spatial: RdlsLocation): RdlsDataset => ({
  id: 'cyclone_iris',
  title: 'Tropical Cyclones (IRIS)',
  description:
    'IRIS tropical cyclone wind speed hazard at this site across multiple return periods, scenarios and climate models.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: 'cyclone_iris.csv',
      title: 'Tropical Cyclones (IRIS) Data',
      description:
        'Tropical cyclone wind speed data from the IRIS project for this site across return periods and scenarios.',
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
            name: 'ssp',
            type: 'string',
            title: 'SSP',
            description: 'Shared Socioeconomic Pathway scenario.',
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
  license: 'CC-BY 4.0',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  sources: [
    {
      name: 'IRIS tropical cyclone model wind speed return period maps',
      description:
        'Tropical cyclone maximum wind speeds (in m/s) generated using the IRIS tropical cyclone model. Wind speeds available from 1 in 10 to 1 in 1,000 year return periods at 1/10 degree spatial resolution. Present (2020) and future (2050) epochs, with SSP1-2.6, SSP2-4.5 and SSP5-8.5 future scenarios. Return period maps generated from an earlier version of the IRIS model event set.',
      lineage:
        'Sparks, N., Toumi, R. (2024) The Imperial College Storm Model (IRIS) Dataset. Scientific Data 11, 424 DOI 10.1038/s41597-024-03250-y and Sparks, N., Toumi, R. (2024). IRIS: The Imperial College Storm Model. Figshare. Collection. DOI 10.6084/m9.figshare.c.6724251.v1',
      url: 'https://doi.org/10.1038/s41597-024-03250-y',
      type: 'dataset',
      component: 'hazard',
      license: 'CC-BY 4.0',
      id: 'source_cyclone_iris',
    },
  ],
});
