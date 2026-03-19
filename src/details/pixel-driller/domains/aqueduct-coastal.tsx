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
import { calculateRagFromReturnPeriodValuesOneThreshold } from '../rag/rag-calculation';
import { ChartConfig, HazardComponentProps, PixelRecord, PixelRecordKeys } from '../types';

// Aqueduct-specific key type definition
export interface AqueductKeys extends PixelRecordKeys {
  hazard: string;
  rp: string;
  rcp: string;
  epoch: string;
  gcm: string;
}

// Chart configs
const aqueductCoastalChartConfig: ChartConfig = {
  id: 'coastal-aqueduct',
  title: 'Coastal flooding – Aqueduct',
  xLabel: 'Return period (years)',
  yLabel: 'Flood height (m)',
  // Coastal flooding: scenario = epoch + rcp, colour by rcp
  seriesFields: ['epoch', 'rcp'],
  colorField: 'rcp',
};

// Thresholds
// Flood height above which damages are substantial (in meters) - used for river and coastal flooding
const FLOOD_HEIGHT_THRESHOLD = 4; // TODO: Make this configurable or derive from domain knowledge

// Type guard for Aqueduct records
const isAqueductRecord = (record: PixelRecord): record is PixelRecord<AqueductKeys> => {
  return record.layer.domain === 'aqueduct';
};

// Filter function for Aqueduct coastal flooding records
const filterAqueductCoastalRecords = (records: PixelRecord[]): PixelRecord<AqueductKeys>[] => {
  return records.filter(isAqueductRecord).filter((r) => r.layer.keys.hazard === 'coastal');
};

const aqueductCoastalBaseName = 'aqueduct__coastal';

const aqueductCoastalColumns: DatapackageTableSchemaField[] = [
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

// Export function for Coastal Flooding (Aqueduct)
const exportAqueductCoastal: ExportFunction = async (allRecords) => {
  const filtered = filterAqueductCoastalRecords(allRecords);
  return buildDomainExportFile(aqueductCoastalBaseName, aqueductCoastalColumns, filtered);
};

export const getAqueductCoastalMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: aqueductCoastalBaseName,
  title: 'Aqueduct Coastal Flood Risk',
  description:
    'Coastal flood risk at this site as modelled by the Aqueduct project, including flood heights for multiple return periods and scenarios.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${aqueductCoastalBaseName}.csv`,
      title: 'Aqueduct Coastal Flood Risk Data',
      description:
        'Coastal flood height data from the Aqueduct project, representing coastal flood depths for this site across scenarios.',
      format: 'csv',
      schema: {
        fields: structuredClone(aqueductCoastalColumns),
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

const aqueductCoastalExportConfig: ExportConfig = {
  exportFunction: exportAqueductCoastal,
  metadataFunction: getAqueductCoastalMetadata,
  readmeFunction: () => ({
    datasetDescription: 'coastal and river flooding (Ward et al 2020; Baugh et al 2024)',
    datasetSources: [
      'Ward, P.J., H.C. Winsemius, S. Kuzma, M.F.P. Bierkens, A. Bouwman, H. de Moel, A. Diaz Loaiza, et al. (2020) Aqueduct Floods Methodology. Technical Note. Washington, D.C.: World Resources Institute. Available online at: https://www.wri.org/publication/aqueduct-floods-methodology',
    ],
  }),
};

export const CoastalFlooding: FC<HazardComponentProps> = ({ records }) => {
  const data = useMemo(
    () => toReturnPeriodRows(filterAqueductCoastalRecords(records), aqueductCoastalChartConfig),
    [records],
  );

  const ragStatus = useMemo(
    () => calculateRagFromReturnPeriodValuesOneThreshold(data, FLOOD_HEIGHT_THRESHOLD),
    [data],
  );

  useRegisterExportConfig('coastal-flooding-aqueduct', aqueductCoastalExportConfig);

  return (
    <HazardAccordion title="Coastal Flooding (Aqueduct)" ragStatus={ragStatus}>
      <ReturnPeriodChart config={aqueductCoastalChartConfig} data={data} />
    </HazardAccordion>
  );
};
