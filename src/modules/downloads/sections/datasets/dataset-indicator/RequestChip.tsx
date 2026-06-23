import { FC } from 'react';

import { StyledChip } from './dataset-chips';

export const RequestChip: FC = () => {
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
