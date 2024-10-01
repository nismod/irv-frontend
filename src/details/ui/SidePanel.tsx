import { BoxProps, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

export const SidePanel: FC<BoxProps> = ({ children }) => {
  return (
    <Paper>
      <Box sx={{ px: 3, py: 2, position: 'relative' }}>{children}</Box>
    </Paper>
  );
};
