import { Error } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import { Outlet, useRouteError } from 'react-router-dom';

import { Nav } from '@/Nav';
import { globalStyleVariables } from '@/theme';

const RootLayout = ({ children }) => {
  return (
    <>
      <Nav height={globalStyleVariables.navbarHeight} />
      <Box
        position="absolute"
        top={globalStyleVariables.navbarHeight}
        bottom={0}
        left={0}
        right={0}
      >
        {children}
      </Box>
    </>
  );
};

export const RootRoute = () => (
  <RootLayout>
    <Outlet />
  </RootLayout>
);

export const RootErrorRoute = () => {
  const error: any = useRouteError();

  return (
    <RootLayout>
      <Container>
        <Box p={2}>
          <Typography>
            <Error />{' '}
            {error.status === 404 ? 'Page not found (404)' : 'There was an unexpected error'}
          </Typography>
        </Box>
      </Container>
    </RootLayout>
  );
};
