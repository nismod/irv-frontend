import { ExportFile } from './download-context';
import { DatapackageTableSchemaField } from './metadata-types';
import { PixelRecord, PixelRecordKeys } from './types';

type CsvColumnConfig = Pick<DatapackageTableSchemaField, 'name' | 'title' | 'description'>;

/**
 * Build a CSV string with a commented first line describing each column,
 * followed by a header row and data rows.
 *
 * By convention we map column keys as:
 * - "value" -> record.value
 * - anything else -> record.layer.keys[key]
 */
export const buildCsvWithComments = <TKeys extends PixelRecordKeys>(
  columns: CsvColumnConfig[],
  records: PixelRecord<TKeys>[],
): string => {
  const comment =
    '# ' + columns.map((c) => `${c.name}${c.description ? `: ${c.description}` : ''}`).join(' | ');
  const header = columns.map((c) => c.name).join(',');

  const dataRows = records.map((rec) => {
    const cells = columns.map((c) => {
      if (c.name === 'value') {
        return rec.value;
      }
      return rec.layer.keys[c.name] ?? null;
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
  baseName: string,
  columns: CsvColumnConfig[],
  records: PixelRecord<TKeys>[],
): ExportFile[] => {
  const csvContent = buildCsvWithComments(columns, records);
  const filename = `${baseName}.csv`;

  return [{ filename, content: csvContent, mimeType: 'text/csv' }];
};
