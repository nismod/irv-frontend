import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { pixelDrillerClickLocationState } from '@/state/map-view/map-interaction-state';

import { SiteDetailsContent } from './SiteDetailsContent';

/**
 * Panel that displays pixel driller site details.
 * Always visible when pixel driller mode is enabled.
 * Takes up all available vertical space.
 */
export const PixelDrillerDetailsPanel: FC = () => {
  const clickLocation = useRecoilValue(pixelDrillerClickLocationState);

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0, // Allow flexbox to shrink
      }}
    >
      <ErrorBoundary message="There was a problem displaying site details.">
        {clickLocation ? (
          <SiteDetailsContent lng={clickLocation.lng} lat={clickLocation.lat} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              minHeight: 0,
              px: 3,
              py: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary" align="center">
              Click on the map to see details for a location
            </Typography>
          </Box>
        )}
      </ErrorBoundary>
    </Paper>
  );
};
