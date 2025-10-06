import Box, { BoxProps } from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FC } from 'react';

export const SidePanel: FC<BoxProps> = ({ children }) => {
  return (
    <Paper>
      <Box sx={{ px: 3, py: 2, position: 'relative' }}>{children}</Box>
    </Paper>
  );
};
