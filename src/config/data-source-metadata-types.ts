export type DataSourceSection = 'hazard' | 'exposure' | 'vulnerability' | 'risk';

export interface DataSourceTableRow {
  id: string;
  section: DataSourceSection;
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

export type DataSourceMetadataModule = readonly DataSourceTableRow[];
