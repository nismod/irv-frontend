import { Box, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import {
  LoaderFunctionArgs,
  Link as RouterLink,
  useLoaderData,
  useLocation,
} from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { Footer } from '@/pages/ui/Footer';

import { CenteredLayout } from '../../components/lib/mui/CenteredLayout';
import { RegionSearchNavigation } from '../../components/selection/RegionSearchNavigation';
import { RegionMetricsHeader } from './RegionMetricsHeader';
import { fetchAllRegions } from './regions';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});

loader.displayName = 'allRegionsLoader';

type AllRegionsLoaderData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as AllRegionsLoaderData;
  const { pathname } = useLocation();

  return (
    <>
      <RegionMetricsHeader />

      <Stack direction="column" gap={15} paddingBottom={100} mt={5}>
        <CenteredLayout>
          <AppLink to="/metrics/regions/afg">&larr; Back</AppLink>
          <Typography variant="h2">All countries</Typography>
          <Stack mt={3} spacing={2}>
            <Box>
              <Typography variant="h3">Search</Typography>
              <Box my={1}>
                <RegionSearchNavigation
                  regions={regions}
                  title="Select a country"
                  metricId="development"
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="h3">Browse</Typography>
              <List>
                {regions.map((reg) => (
                  <li key={reg.name}>
                    <ListItemButton component={RouterLink} to={reg.name} state={{ from: pathname }}>
                      <ListItemText primary={reg.name_long} />
                    </ListItemButton>
                  </li>
                ))}
              </List>
            </Box>
          </Stack>
        </CenteredLayout>
      </Stack>
      <Footer />
    </>
  );
};

Component.displayName = 'AllRegionsRoute';
