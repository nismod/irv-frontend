import { Box, Container, Stack, Typography } from '@mui/material';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { fetchAllRegions } from '../data/regions';
import { RegionSearchNavigation } from '../sections/RegionSearchNavigation';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});

loader.displayName = 'landingPageLoader';

export type LandingPageData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as LandingPageData;

  return (
    <Container>
      <Stack direction="column" alignItems="center">
        <Box p={2}>
          <DownloadsIntroText />
        </Box>
        <Box p={2}>
          <Box p={1}>
            <RegionSection regions={regions} />
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};

Component.displayName = 'LandingPage';

function DownloadsIntroText() {
  return <Typography>Some intro text here</Typography>;
}

function RegionSection({ regions }: Pick<LandingPageData, 'regions'>) {
  return (
    <Stack direction="column">
      <RegionSearchNavigation regions={regions} />
      <Typography textAlign="center">
        Or <AppLink to="regions">browse all countries</AppLink>
      </Typography>
    </Stack>
  );
}
