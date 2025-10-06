import Box from '@mui/material/Box';
import { FC, ReactNode } from 'react';

export const MapHud: FC<{
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  children?: ReactNode;
}> = ({ children, top = 0, right = 0, bottom = 0, left = 0 }) => (
  <Box
    position="absolute"
    {...{ top, right, bottom, left }}
    zIndex={1000}
    sx={{ pointerEvents: 'none' }}
  >
    {children}
  </Box>
);
