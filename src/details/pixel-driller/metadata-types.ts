// Simplified TypeScript types for RDLS metadata.
// These are intentionally narrower than the full JSON Schema, and only cover
// the parts we currently populate in the generated metadata.json.

export type RiskDataType = 'hazard' | 'exposure' | 'vulnerability' | 'loss';

export interface RdlsEntity {
  name: string;
  email?: string;
  url?: string;
}

export interface RdlsGeometry {
  type: 'Point';
  // [longitude, latitude]
  coordinates: [number, number];
}

export interface RdlsLocation {
  geometry: RdlsGeometry;
}

export interface RdlsResourceSchemaField {
  name: string;
  type: 'string' | 'number';
  title?: string;
  description?: string;
}

export interface RdlsResourceSchema {
  fields: RdlsResourceSchemaField[];
}

export interface RdlsDialect {
  delimiter?: string;
  header?: boolean;
  commentChar?: string;
  nullSequence?: string;
}

export interface RdlsResource {
  id: string;
  title: string;
  description: string;
  /**
   * Human-readable file format (e.g. "csv").
   */
  format: string;
  schema?: RdlsResourceSchema;
  dialect?: RdlsDialect;
}

export interface RdlsDataset {
  id: string;
  title: string;
  description: string;
  risk_data_type: RiskDataType[];
  spatial: RdlsLocation;
  resources: RdlsResource[];
  publisher: RdlsEntity;
  license: string;
  contact_point: RdlsEntity;
  creator: RdlsEntity;
  attributions?: RdlsEntity[];
}

export interface RdlsMetadataPackage {
  /**
   * Reference to the local metadata schema file.
   * Matches the example in metadata.example.json.
   */
  $schema: string;
  datasets: RdlsDataset[];
}
