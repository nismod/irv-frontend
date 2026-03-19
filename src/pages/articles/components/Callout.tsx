import { Box, Paper, Typography } from '@mui/material';

export const Callout = ({
  title = 'Note',
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      my: 2,
      maxWidth: '50rem',
      mx: 'auto',
      borderLeftWidth: 4,
      borderLeftColor: 'primary.main',
    }}
  >
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Box sx={{ '& p:last-child': { mb: 0 } }}>{children}</Box>
  </Paper>
);
