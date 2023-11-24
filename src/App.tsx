import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { theme } from './theme';

import 'maplibre-gl/dist/maplibre-gl.css';
import 'react-spring-bottom-sheet/dist/style.css';
import './index.css';

import { QueryClientProvider } from 'react-query';
import { RecoilURLSyncJSON } from 'recoil-sync';

import { RasterColorMapSourceProvider } from '@/lib/data-map/legend/use-raster-color-map-values';
import { RecoilLocalStorageSync } from '@/lib/recoil/sync-stores/RecoilLocalStorageSync';

import { terracottaColorMapValuesQuery } from '@/config/terracotta-color-map';

import { queryClient } from './query-client';
import { router } from './router';

export const App = () => {
  return (
    <RecoilRoot>
      <RecoilLocalStorageSync storeKey="local-storage">
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
      </RecoilLocalStorageSync>
    </RecoilRoot>
  );
};
