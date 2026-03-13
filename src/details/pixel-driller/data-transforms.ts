import {
  ChartConfig,
  KeyField,
  PixelRecord,
  PixelRecordKeys,
  PixelResponse,
  ReturnPeriodRow,
} from './types';

export const asPixelResponse = (data: unknown): PixelResponse => data as PixelResponse;

const getFieldValue = <TKeys extends PixelRecordKeys = PixelRecordKeys>(
  record: PixelRecord<TKeys>,
  field: KeyField,
): string | undefined => {
  if (field === 'domain') return record.layer.domain;
  const value = record.layer.keys[field];
  return value == null ? undefined : String(value);
};

/**
 * Helper to map raw pixel records into chart rows for the prototype.
 * This is intentionally light-weight and can be replaced once the real API stabilises.
 *
 * The series label is derived entirely from the per-domain ChartConfig
 * (e.g. Aqueduct might use epoch+rcp+gcm, IRIS cyclones might use epoch+ssp+gcm).
 */
const buildScenarioLabel = <TKeys extends PixelRecordKeys = PixelRecordKeys>(
  record: PixelRecord<TKeys>,
  config: ChartConfig,
): string => {
  const parts = config.seriesFields
    .map((field) => getFieldValue(record, field))
    .filter((x): x is string => Boolean(x));

  if (parts.length > 0) {
    return parts.join(' – ');
  }

  // Last resort: domain name so that Vega still has a series identifier
  return record.layer.domain;
};

export const toReturnPeriodRows = <TKeys extends PixelRecordKeys = PixelRecordKeys>(
  records: PixelRecord<TKeys>[],
  config: ChartConfig,
): ReturnPeriodRow[] =>
  records
    .map<ReturnPeriodRow | null>((r) => {
      // Skip null values entirely (no data_type field in new API)
      if (r.value == null) {
        return null;
      }

      const { rp, ...otherKeys } = r.layer.keys;

      return {
        rp: Number(rp),
        value: r.value,
        domain: r.layer.domain,
        scenario: buildScenarioLabel(r, config),
        ...otherKeys,
      };
    })
    .filter((row): row is ReturnPeriodRow => row !== null);
