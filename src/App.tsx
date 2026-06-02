import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { RasterColorMapSourceProvider } from '@/lib/data-map/legend/use-raster-color-map-values';

import { terracottaColorMapValuesQueryAtomFamily } from '@/config/terracotta-color-map';

import { queryClient } from './query-client';
import { router } from './router';
import { theme } from './theme';

import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';

export const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <RasterColorMapSourceProvider atomFamily={terracottaColorMapValuesQueryAtomFamily}>
            <RouterProvider router={router} />
          </RasterColorMapSourceProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
