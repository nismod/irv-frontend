import { ExportFile } from './download-context';
import { PixelRecord, PixelRecordKeys } from './types';

export interface CsvColumnConfig {
  /** Machine-readable column key, e.g. "rp", "value" */
  key: string;
  /** Human-readable column label */
  label: string;
  /** Description used in the CSV header comment line */
  description: string;
}

export interface DomainExportConfig {
  /**
   * Base name for the domain export.
   * The final filename will be `${baseName}.csv`.
   * Example: "isimip__drought__occurrence".
   */
  baseName: string;
  /** Column configuration, in the order they appear in the CSV */
  columns: CsvColumnConfig[];
  /**
   * Domain-specific metadata stub.
   * This field is no longer used for generating per-domain JSON files,
   * but kept for backwards compatibility.
   */
  metadata: Record<string, unknown>;
}

/**
 * Build a CSV string with a commented first line describing each column,
 * followed by a header row and data rows.
 *
 * By convention we map column keys as:
 * - "value" -> record.value
 * - anything else -> record.layer.keys[key]
 */
export const buildCsvWithComments = <TKeys extends PixelRecordKeys>(
  config: DomainExportConfig,
  records: PixelRecord<TKeys>[],
): string => {
  const comment = '# ' + config.columns.map((c) => `${c.key}: ${c.description}`).join(' | ');
  const header = config.columns.map((c) => c.key).join(',');

  const dataRows = records.map((rec) => {
    const cells = config.columns.map((c) => {
      if (c.key === 'value') {
        return rec.value;
      }
      return rec.layer.keys[c.key] ?? null;
    });

    return cells.map((cell) => (cell == null ? '' : String(cell))).join(',');
  });

  return [comment, header, ...dataRows].join('\n');
};

/**
 * Build the CSV export file for a domain.
 * Returns a single CSV file, even if the records array is empty.
 * Metadata is now centralized in a single metadata.json file.
 */
export const buildDomainExportFiles = <TKeys extends PixelRecordKeys>(
  config: DomainExportConfig,
  records: PixelRecord<TKeys>[],
): ExportFile[] => {
  const csvContent = buildCsvWithComments(config, records);
  const base = config.baseName;

  return [{ filename: `${base}.csv`, content: csvContent, mimeType: 'text/csv' }];
};
