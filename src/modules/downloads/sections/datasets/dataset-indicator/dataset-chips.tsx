import Error from '@mui/icons-material/Error';
import Chip from '@mui/material/Chip';
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
