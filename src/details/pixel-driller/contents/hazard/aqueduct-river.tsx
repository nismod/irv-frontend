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
import {
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
  COMMON_DIALECT,
  COMMON_PUBLISHER,
} from '../../download/metadata-common';
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

export const getAqueductRiverMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: aqueductRiverBaseName,
  title: 'Aqueduct River Flood Risk',
  description:
    'River flood risk at this site as modelled by the Aqueduct project, including flood heights for multiple return periods and scenarios.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${aqueductRiverBaseName}.csv`,
      title: 'Aqueduct River Flood Risk Data',
      description:
        'River flood height data from the Aqueduct project, representing fluvial inundation depth in meters at this site across return periods, emissions scenarios, and current and future epochs.',
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
            description: 'Global Climate Model.',
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
  lineage: {
    description: 'Point data extract from source.',
    sources: [
      {
        id: 'source_aqueduct_floods',
        name: 'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020). Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute.',
        url: 'https://www.wri.org/publication/aqueduct-floods-methodology',
        type: 'dataset',
        risk_data_type: 'hazard',
        license: 'CC-BY-4.0',
      },
    ],
  },
});

const aqueductRiverExportConfig: ExportConfig = {
  exportFunction: exportAqueductRiver,
  metadataFunction: getAqueductRiverMetadata,
  readmeFunction: () => ({
    datasetDescription: 'coastal and river flooding (Ward et al 2020; Baugh et al 2024)',
    datasetSources: [
      'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020) Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute. Available online at: https://www.wri.org/publication/aqueduct-floods-methodology',
    ],
  }),
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
