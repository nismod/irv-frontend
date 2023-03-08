import { Box, CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Nav } from './Nav';
import { globalStyleVariables, theme } from './theme';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-spring-bottom-sheet/dist/style.css';
import './index.css';

export const App = () => {
  return (
    <RecoilRoot>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Nav height={globalStyleVariables.navbarHeight} />
          <Box
            position="absolute"
            top={globalStyleVariables.navbarHeight}
            bottom={0}
            left={0}
            right={0}
          >
            <Outlet />
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </RecoilRoot>
  );
};
