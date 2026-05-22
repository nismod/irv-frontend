import type { RdlsSource, RiskDataType } from '@/details/pixel-driller/download/metadata-types';

import type { DataSourceTableRow } from './data-source-metadata-types';

export interface RasterDatasetMetadata {
  id: string;
  title: string;
  description: string;
  risk_data_type: RiskDataType[];
  license: string;
  lineage: {
    description: string;
    sources: RdlsSource[];
  };
  readme: {
    datasetDescription: string;
    datasetSources: string[];
  };
  dataSourceTable?: DataSourceTableRow;
}

export type RasterMetadataModule = readonly RasterDatasetMetadata[];

export const POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION = 'Point data extract from source.';
