import {
  Box,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { LoaderFunctionArgs, Link as RouterLink, useLoaderData } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { fetchAllRegions } from '../../data/regions';
import { RegionSearchNavigation } from '../../sections/RegionSearchNavigation';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});

loader.displayName = 'allRegionsLoader';

type AllRegionsLoaderData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as AllRegionsLoaderData;

  return (
    <Container>
      <AppLink to="/downloads">&larr; Back to downloads main page</AppLink>
      <Typography variant="h2">All countries</Typography>
      <Stack mt={3} spacing={2}>
        <Box>
          <Typography variant="h3">Search</Typography>
          <Box my={1}>
            <RegionSearchNavigation regions={regions} />
          </Box>
        </Box>
        <Box>
          <Typography variant="h3">Browse</Typography>
          <List>
            {regions.map((reg) => (
              <li key={reg.name}>
                <ListItemButton
                  component={RouterLink}
                  to={reg.name}
                  state={{ from: '/downloads/regions' }}
                >
                  <ListItemText primary={reg.name_long} />
                </ListItemButton>
              </li>
            ))}
          </List>
        </Box>
      </Stack>
    </Container>
  );
};

Component.displayName = 'AllRegionsRoute';
