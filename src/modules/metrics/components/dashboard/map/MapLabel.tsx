import { Box } from '@mui/system';
import { FC } from 'react';

export const MapLabel: FC<{
  top?: number;
  right?: number;
  left?: number;
  highlightData: any;
  selectedYear: number;
}> = ({ top = 0, right = 0, left = 0, highlightData, selectedYear = 2021 }) => {
  return highlightData ? (
    <Box
      position="absolute"
      {...{ right, top }}
      zIndex={1000}
      sx={{ pointerEvents: 'none', backgroundColor: 'white', padding: 1, opacity: 0.9 }}
    >
      <b>{highlightData.Region.split('(')[0].trim()}:</b> {highlightData[selectedYear]}
    </Box>
  ) : null;
};
