import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { theme } from './theme';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-spring-bottom-sheet/dist/style.css';
import './index.css';

import { router } from './router';

export const App = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};
