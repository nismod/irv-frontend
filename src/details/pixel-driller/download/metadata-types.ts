// Simplified TypeScript types for Datapackage Table Schema.
// These are intentionally narrower than the full JSON Schema, and only cover
// the parts we currently populate in the generated metadata.json.
// The types were generated from the JSON schema files in the `schemas` directory.

export interface DatapackageTableSchemaField {
  name: string;
  type: 'string' | 'number';
  title?: string;
  description?: string;
}

export interface DatapackageTableSchema {
  fields: DatapackageTableSchemaField[];
}

export interface DatapackageTableDialect {
  delimiter?: string;
  header?: boolean;
  commentChar?: string;
  nullSequence?: string;
}

// Simplified TypeScript types for Risk Data Library Standard metadata.
// These are intentionally narrower than the full JSON Schema, and only cover
// the parts we currently populate in the generated metadata.json.

export type RiskDataType = 'hazard' | 'exposure' | 'vulnerability' | 'loss';

export interface RdlsAttribution {
  id: string;
  entity: RdlsEntity;
  role: string;
}

export interface RdlsEntity {
  name: string;
  email?: string;
  url?: string;
}

export type RdlsLocation =
  | {
      // [longitude, latitude]
      centroid: [number, number];
    }
  | {
      scale: 'global';
    };

export interface RdlsResource {
  id: string;
  title: string;
  description: string;
  access_url?: string;
  download_url?: string;
  media_type?: string;
  /**
   * Human-readable file format (e.g. "csv").
   */
  format?: string;
  conforms_to?: string;
  /**
   * Table Schema for the resource - included from the Datapackage Table Schema specification.
   */
  schema?: DatapackageTableSchema;
  /**
   * Table Dialect for the resource - included from the Datapackage Table Dialect specification.
   */
  dialect?: DatapackageTableDialect;
}

// Pulling in optional fields from RDLS 1.0-dev
// https://github.com/GFDRR/rdl-standard/blob/1.0-dev/schema/rdls_schema.json
// at risk of some change, will feedback and likely adopt explicitly
export interface RdlsSource {
  id: string;
  name?: string;
  url?: string;
  type?: string;
  risk_data_type?: string;
  used_in?: string;
  license?: string;
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
  attributions?: RdlsAttribution[];
  lineage?: {
    description?: string;
    sources: RdlsSource[];
  };
}

export interface RdlsMetadataPackage {
  /**
   * Reference to the local metadata schema file.
   * Matches the example in metadata.example.json.
   */
  $schema: string;
  datasets: RdlsDataset[];
}
