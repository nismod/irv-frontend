import JSZip from 'jszip';

import { DownloadFile } from './types';

/**
 * Builds a ZIP file from an array of files.
 * Handles both string and Blob content types.
 *
 * @param files - Array of files to include in the ZIP
 * @returns Promise that resolves to a Blob containing the ZIP file
 */
export const buildZipFile = async (files: DownloadFile[]): Promise<Blob> => {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.filename, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Triggers a browser download of a DownloadFile.
 *
 * @param file - The DownloadFile to download
 */
export function downloadFile(file: DownloadFile) {
  let blob: Blob;
  if ('mimeType' in file) {
    blob = new Blob([file.content], { type: file.mimeType });
  } else {
    blob = file.content;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
