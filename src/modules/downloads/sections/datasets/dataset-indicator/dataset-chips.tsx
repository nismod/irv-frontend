import Error from '@mui/icons-material/Error';
import Chip from '@mui/material/Chip';
import { JobProgress } from '@nismod/irv-autopkg-client';
import { ComponentProps, ElementType, FC } from 'react';

import { eventStopPropagation } from '@/lib/helpers';

import { ResponsiveProgress } from '@/modules/downloads/components/ResponsiveProgress';

import { DatasetStatus } from './status-logic/dataset-status';

export const StyledChip: typeof Chip = <T extends ElementType<any>>(
  props: ComponentProps<typeof Chip<T>>,
) => <Chip<T> sx={{ minWidth: '130px' }} {...props} />;

export const InfoChip: FC<{ status: DatasetStatus.Loading | DatasetStatus.Unknown }> = ({
  status,
}) => {
  const isLoading = status === DatasetStatus.Loading;
  return (
    <StyledChip
      icon={isLoading ? <ResponsiveProgress color="inherit" /> : <Error />}
      label={isLoading ? 'LOADING' : 'ERROR'}
      title={
        isLoading
          ? 'Information about data is loading'
          : 'An unexpected error has occurred, please try later'
      }
      color="default"
      onClick={eventStopPropagation}
      clickable={false}
    />
  );
};

export const ProcessingInfoChip: FC<{
  status: DatasetStatus.Queued | DatasetStatus.Processing;
  progress: JobProgress | null;
}> = ({ status, progress }) => {
  const isProcessing = status === DatasetStatus.Processing;
  return (
    <StyledChip
      icon={
        <ResponsiveProgress
          color={isProcessing ? 'primary' : 'inherit'}
          value={isProcessing ? progress?.percent_complete : undefined}
          variant={isProcessing && progress != null ? 'determinate' : 'indeterminate'}
        />
      }
      color="primary"
      label={isProcessing ? 'PROCESSING' : 'QUEUED'}
      title={
        isProcessing
          ? progress != null
            ? `Processing dataset - ${progress.percent_complete}% done`
            : 'Processing dataset...'
          : 'Dataset in queue for processing...'
      }
      onClick={eventStopPropagation}
      clickable={false}
    />
  );
};

export const SuccessChip: FC<{
  status: DatasetStatus.ProcessingSuccess | DatasetStatus.ProcessingSkipped;
}> = ({ status }) => {
  const isSuccess = status === DatasetStatus.ProcessingSuccess;
  return (
    <StyledChip
      icon={<ResponsiveProgress color="inherit" variant="indeterminate" />}
      color={isSuccess ? 'success' : 'primary'}
      label={isSuccess ? 'SUCCESS' : 'PROCESSING'}
      title={
        isSuccess
          ? 'Successfully processed, finalizing data package...'
          : 'Dataset already requested by another user, waiting for the processing to finish...'
      }
      onClick={eventStopPropagation}
      clickable={false}
    />
  );
};
