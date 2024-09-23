import {
  Box,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import {
  LoaderFunctionArgs,
  Link as RouterLink,
  useLoaderData,
  useLocation,
} from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { RegionSearchNavigation } from '@/modules/metrics/components/region-search/RegionSearchNavigation';
import { fetchAllRegions } from '@/modules/metrics/data/fetch-regions';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});
loader.displayName = 'allRegionsLoader';

type AllRegionsLoaderData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as AllRegionsLoaderData;
  const { pathname } = useLocation();

  return (
    <Stack direction="column" gap={15} paddingBottom={100} mt={5}>
      <Container maxWidth="md">
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
      </Container>
    </Stack>
  );
};

Component.displayName = 'RegionMetricsIndexPage';
