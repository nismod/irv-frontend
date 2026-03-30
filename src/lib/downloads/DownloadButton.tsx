import { Download } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback, useState } from 'react';
import { Promisable } from 'type-fest';

import { downloadFile } from './download-utils';
import { DownloadFile } from './types';

export interface DownloadButtonProps {
  title: string;
  makeFile: () => Promisable<DownloadFile>;
  disabled?: boolean;
}

export const DownloadButton = ({ title, makeFile, disabled }: DownloadButtonProps) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDownload = useCallback(async () => {
    if (downloading || !!error || disabled) return;
    setDownloading(true);
    try {
      const file = await makeFile();
      downloadFile(file);
    } catch (error) {
      setError(error as Error);
      console.error('Error downloading file:', error);
    } finally {
      setDownloading(false);
    }
  }, [makeFile, downloading, error, disabled]);

  return (
    <IconButton
      title={title}
      onClick={handleDownload}
      disabled={downloading || !!error || disabled}
    >
      <Download />
    </IconButton>
  );
};
