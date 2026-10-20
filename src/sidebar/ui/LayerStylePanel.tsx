import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FC, ReactNode } from 'react';

export const LayerStylePanel: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Paper>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Paper>
    </Box>
  );
};
