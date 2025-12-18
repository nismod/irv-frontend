import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FC } from 'react';

import { PrototypeCharts } from './PrototypeCharts';

interface SiteDetailsContentProps {
  lng: number;
  lat: number;
}

/**
 * Component that displays detailed information for a selected site location.
 * This component will be expanded to show actual site details based on the coordinates.
 */
export const SiteDetailsContent: FC<SiteDetailsContentProps> = ({ lng, lat }) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        height: '100%',
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Site Details
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Longitude: {lng.toFixed(6)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Latitude: {lat.toFixed(6)}
      </Typography>
      <PrototypeCharts />
    </Box>
  );
};
