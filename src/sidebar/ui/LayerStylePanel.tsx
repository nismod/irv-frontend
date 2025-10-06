import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FC, ReactNode } from 'react';

export const LayerStylePanel: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Box mt={2}>
      <Paper>
        <Box p={2}>{children}</Box>
      </Paper>
    </Box>
  );
};
