import { d3 } from '@/lib/d3';
import { DownloadFile } from '@/lib/downloads/types';

import { PixelRecord, PixelRecordKeys } from '../types';
import { ExportConfig } from './download-context';
import { DatapackageTableSchemaField } from './metadata-types';
import readmeTemplate from './README.md.txt?raw';

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
 * Markers in README template replaced at download time.
 */
const DATASET_DESCRIPTION_LIST_MARKER = '<!--PIXEL_DRILLER_DATASET_DESCRIPTION_LIST-->';
const DATASET_SOURCES_LIST_MARKER = '<!--PIXEL_DRILLER_DATASET_SOURCES_LIST-->';

interface ReadmeTemplateFillArgs {
  datasetDescriptionListText: string; // already bullet-prefixed and newline-joined
  datasetSourcesListText: string; // already bullet-prefixed and newline-joined
}

const replaceMarkerStrict = (
  template: string,
  marker: string,
  replacement: string,
  markerLabel: string,
): string => {
  const occurrences = template.split(marker).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `Expected exactly one "${markerLabel}" marker occurrence in README template, found ${occurrences}.`,
    );
  }

  return template.replace(marker, replacement);
};

/**
 * Fill a README template by replacing both marker comment lines.
 */
const fillReadmeTemplate = (args: ReadmeTemplateFillArgs): string => {
  let filled = readmeTemplate;
  filled = replaceMarkerStrict(
    filled,
    DATASET_DESCRIPTION_LIST_MARKER,
    args.datasetDescriptionListText,
    'dataset description',
  );
  filled = replaceMarkerStrict(
    filled,
    DATASET_SOURCES_LIST_MARKER,
    args.datasetSourcesListText,
    'dataset sources',
  );
  return filled;
};

/**
 * Deduplicate a list of strings, preserving order.
 */
const dedupePreserveOrder = (items: string[]): string[] => {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    deduped.push(item);
  }
  return deduped;
};

/**
 * Build the final README.md for a ZIP package, assembling bullet lists from
 * all registered domains.
 */
export const buildReadmeFile = (exportConfigs: Map<string, ExportConfig>): DownloadFile => {
  const readmeContents = Array.from(exportConfigs.values()).map(({ readmeFunction }) =>
    readmeFunction(),
  );

  const datasetDescriptionList = dedupePreserveOrder(
    readmeContents
      .map((c) => c.datasetDescription)
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  );

  const datasetSourcesList = dedupePreserveOrder(
    readmeContents
      .flatMap((c) => c.datasetSources)
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  );

  // Sort the list of dataset sources alphabetically.
  datasetSourcesList.sort((a, b) => a.localeCompare(b));

  const datasetDescriptionListText = datasetDescriptionList.map((s) => `- ${s}`).join('\n');
  const datasetSourcesListText = datasetSourcesList.map((s) => `- ${s}`).join('\n');

  const filledReadmeMarkdown = fillReadmeTemplate({
    datasetDescriptionListText,
    datasetSourcesListText,
  });

  return {
    filename: 'README.md',
    content: filledReadmeMarkdown,
    mimeType: 'text/markdown',
  };
};
