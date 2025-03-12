import { Box } from '@mui/system';
import { FC } from 'react';

import { AnnualGdlRecord } from '@/modules/metrics/types/AnnualGdlData';

export const MapLabel: FC<{
  top?: number;
  right?: number;
  highlightData: AnnualGdlRecord | undefined;
}> = ({ top = 0, right = 0, highlightData }) => {
  return highlightData ? (
    <Box
      position="absolute"
      {...{ right, top }}
      zIndex={1000}
      sx={{ pointerEvents: 'none', backgroundColor: 'white', padding: 1, opacity: 0.9 }}
    >
      <b>{highlightData.regionName.split('(')[0].trim()}:</b> {highlightData.value}
    </Box>
  ) : null;
};
