export type PixelDomain = 'aqueduct' | 'jrc_flood' | string;

export interface PixelRecordKeys {
  // NOTE: different domains expose different keys; keep these optional
  hazard?: string;
  rp?: string;
  rcp?: string;
  epoch?: string;
  gcm?: string;
  ssp?: string;
  metric?: string;
  impact_model?: string;
  subtype?: string;
}

export interface PixelRecord {
  value: number | null;
  layer: {
    domain: PixelDomain;
    keys: PixelRecordKeys;
    id: string;
  };
}

export interface PixelResponse {
  point: {
    lat: number;
    lon: number;
  };
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
  records: PixelRecord[];
}
