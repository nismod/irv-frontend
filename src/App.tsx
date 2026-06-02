import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSON } from 'recoil-sync';

import { RasterColorMapSourceProvider } from '@/lib/data-map/legend/use-raster-color-map-values';

import { terracottaColorMapValuesQuery } from '@/config/terracotta-color-map';

import { queryClient } from './query-client';
import { router } from './router';
import { theme } from './theme';

import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';

export const App = () => {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSON storeKey="url-json" location={{ part: 'queryParams' }}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <RasterColorMapSourceProvider state={terracottaColorMapValuesQuery}>
                <RouterProvider router={router} />
              </RasterColorMapSourceProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </RecoilURLSyncJSON>
    </RecoilRoot>
  );
};
