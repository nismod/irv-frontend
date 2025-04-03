import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export const LegendLayout = ({
  label,
  description,
  children,
}: {
  label: string | ReactNode;
  description?: string | ReactNode;
  children: ReactNode;
}) => (
  <Box mb={2}>
    <Box mb={1}>
      <Typography variant="body1">{label}</Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
    <Box minWidth={255}>{children}</Box>
  </Box>
);
