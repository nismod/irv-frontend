import type { RdlsSource, RiskDataType } from '@/details/pixel-driller/download/metadata-types';

export type RasterDataSourceSection = 'hazard' | 'exposure' | 'risk';

export interface RasterDataSourceTableRow {
  id: string;
  section: RasterDataSourceSection;
  dataset: string;
  source: {
    label: string;
    url?: string;
  };
  citation: string[];
  license: {
    label: string;
    url?: string;
  };
  notes: string[];
}

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
  dataSourceTable?: RasterDataSourceTableRow;
}

export type RasterMetadataModule = readonly RasterDatasetMetadata[];

export const POINT_DATA_EXTRACT_LINEAGE_DESCRIPTION = 'Point data extract from source.';
