import JSZip from 'jszip';

import { ExportFile } from './download-context';

/**
 * Builds a ZIP file from an array of export files.
 * Handles both string and Blob content types.
 *
 * @param files - Array of export files to include in the ZIP
 * @returns Promise that resolves to a Blob containing the ZIP file
 */
export const buildZipFile = async (files: ExportFile[]): Promise<Blob> => {
  const zip = new JSZip();

  for (const file of files) {
    if (typeof file.content === 'string') {
      zip.file(file.filename, file.content);
    } else {
      // Handle Blob content
      zip.file(file.filename, file.content);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Triggers a browser download of a Blob.
 *
 * @param blob - The Blob to download
 * @param filename - The filename for the download
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Clean up the object URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
