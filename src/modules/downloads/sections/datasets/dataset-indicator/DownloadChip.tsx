import { ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { FC } from 'react';

import { StyledChip } from './dataset-chips';
import { DataResource } from './status-logic/package-data';

export const DownloadChip: FC<{
  resource: DataResource;
  pv: ProcessorVersionMetadata;
  onGoToDownload: () => void;
}> = ({ resource, pv, onGoToDownload }) => {
  return (
    <StyledChip
      color="success"
      label="READY"
      title={`Download data for ${pv.data_title}`}
      onClick={(e) => {
        onGoToDownload();
        e.stopPropagation();
      }}
    />
  );
};
