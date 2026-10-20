import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  <Box
    sx={{
      mb: 2,
    }}
  >
    <Box
      sx={{
        mb: 1,
      }}
    >
      <Typography variant="body1">{label}</Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Box>
    <Box
      sx={{
        minWidth: 255,
      }}
    >
      {children}
    </Box>
  </Box>
);
