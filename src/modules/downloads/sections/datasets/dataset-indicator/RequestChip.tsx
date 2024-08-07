import { BoundarySummary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { FC } from 'react';

import { StyledChip } from './dataset-chips';
import { DatasetStatus } from './status-logic/dataset-status';

export const RequestChip: FC<{
  status: DatasetStatus.Prepare | DatasetStatus.ProcessingFailed;
  boundary: BoundarySummary;
  pv: ProcessorVersionMetadata;
}> = () => {
  // See git history for handling failure/re-request. Now set directly to unavailable.
  return (
    <StyledChip
      disabled={true}
      color="default"
      title="Dataset unavailable"
      label="UNAVAILABLE"
      onClick={(e) => {
        e.stopPropagation();
      }}
    />
  );
};
