import { Error } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { JobProgress, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { FC } from 'react';

import { withProps } from '@/lib/react/with-props';

import { ResponsiveProgress } from '@/modules/downloads/components/ResponsiveProgress';

import { DatasetStatus } from './status-logic/dataset-status';
import { DataResource } from './status-logic/package-data';

export const StyledChip = withProps(Chip, {
  sx: {
    minWidth: '130px',
  },
});

export const InfoChip: FC<{ status: DatasetStatus.Loading | DatasetStatus.Unknown }> = ({
  status,
}) => {
  const isLoading = status === DatasetStatus.Loading;
  return (
    <StyledChip
      disabled={true}
      icon={isLoading ? <ResponsiveProgress color="inherit" /> : <Error />}
      label={isLoading ? 'LOADING' : 'ERROR'}
      title={
        isLoading
          ? 'Information about data is loading'
          : 'An unexpected error has occurred, please try later'
      }
      color="default"
    />
  );
};

export const ProcessingInfoChip: FC<{
  status: DatasetStatus.Queued | DatasetStatus.Processing | DatasetStatus.ProcessingSuccess;
  progress: JobProgress | null;
}> = ({ status, progress }) => {
  const isProcessing = status === DatasetStatus.Processing;
  const isSuccess = status === DatasetStatus.ProcessingSuccess;
  return (
    <StyledChip
      icon={
        <ResponsiveProgress
          color={isProcessing ? 'primary' : 'inherit'}
          value={isProcessing ? progress?.percent_complete : undefined}
          variant={!isSuccess && isProcessing && progress != null ? 'determinate' : 'indeterminate'}
        />
      }
      color={isSuccess ? 'success' : 'primary'}
      label={isSuccess ? 'SUCCESS' : isProcessing ? 'PROCESSING' : 'QUEUED'}
      title={
        isSuccess
          ? 'Successfully processed, finalizing data packge...'
          : isProcessing
          ? progress != null
            ? `Processing dataset - ${progress.percent_complete}% done`
            : 'Processing dataset...'
          : 'Dataset in queue for processing...'
      }
    />
  );
};

export const DownloadChip: FC<{
  resource: DataResource;
  pv: ProcessorVersionMetadata;
}> = ({ resource, pv }) => {
  return <StyledChip color="success" label="READY" title={`Download data for ${pv.data_title}`} />;
};
