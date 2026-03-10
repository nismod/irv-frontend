import { d3 } from '@/lib/d3';
import { DownloadFile } from '@/lib/downloads/types';

import { DatapackageTableSchemaField } from './metadata-types';
import readmeTemplate from './README.md.txt?raw';
import { PixelRecord, PixelRecordKeys } from './types';

type CsvColumnConfig = Pick<DatapackageTableSchemaField, 'name' | 'description'>;

/**
 * Build a CSV string with a commented first line describing each column,
 * followed by a header row and data rows.
 *
 * By convention we map column keys as:
 * - "value" -> record.value
 * - anything else -> record.layer.keys[key]
 */
export const buildCsvWithComments = (
  columns: CsvColumnConfig[],
  records: Record<string, any>[],
): string => {
  const comment =
    '# ' + columns.map((c) => `${c.name}${c.description ? `: ${c.description}` : ''}`).join(' | ');
  const csvText = d3.dsv.csvFormat(
    records,
    columns.map((c) => c.name),
  );

  return [comment, csvText].join('\n');
};

/**
 * Build the CSV export file for a domain.
 * Returns a single CSV file, even if the records array is empty.
 * Metadata is now centralized in a single metadata.json file.
 */
export const buildDomainExportFile = <TKeys extends PixelRecordKeys>(
  baseName: string,
  columns: CsvColumnConfig[],
  records: PixelRecord<TKeys>[],
): DownloadFile => {
  const simplifiedRecords = records.map((rec) => ({
    value: rec.value,
    ...rec.layer.keys,
  }));

  return {
    filename: `${baseName}.csv`,
    content: buildCsvWithComments(columns, simplifiedRecords),
    mimeType: 'text/csv',
  };
};

/**
 * Returns the static README file to include in every ZIP.
 */
export const getReadmeFile = (): DownloadFile => {
  return {
    filename: 'README.md',
    content: readmeTemplate,
    mimeType: 'text/markdown',
  };
};
