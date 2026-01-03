export type PixelDomain = 'aqueduct' | 'jrc_flood' | string;

// Base type for pixel record keys - all keys are optional strings
export type PixelRecordKeys = Record<string, string | undefined>;

// Generic pixel record that accepts a specific keys type
export interface PixelRecord<TKeys extends PixelRecordKeys = PixelRecordKeys> {
  value: number | null;
  layer: {
    domain: PixelDomain;
    keys: TKeys;
    id: string;
  };
}

export interface PixelResponse {
  point: {
    lat: number;
    lon: number;
  };
  // Results contain mixed record types, so use base PixelRecord
  results: PixelRecord[];
}

export type ReturnPeriodRow = {
  rp: number;
  value: number;
  rcp?: string;
  epoch?: string;
  gcm?: string;
  ssp?: string;
  scenario: string;
  domain: PixelDomain;
  hazard?: string;
  isBaselineComparison?: boolean; // True when this is baseline data shown for comparison
};

export type KeyField = keyof PixelRecordKeys | 'domain';

export interface ChartConfig {
  id: string;
  title: string;
  xLabel: string;
  yLabel: string;
  /** Fields that together define the logical "scenario" / series */
  seriesFields: KeyField[];
  /** Which field to use for colour (e.g. rcp or ssp). Optional. */
  colorField?: KeyField;
}

export interface HazardComponentProps {
  // Accept base PixelRecord since components receive mixed records from API
  records: PixelRecord[];
}
