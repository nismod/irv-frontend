import { Box, Stack, Typography } from '@mui/material';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { CenteredLayout } from '../components/CenteredLayout';
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
    <CenteredLayout>
      <Stack direction="column">
        <Box p={2}>
          <DownloadsIntroText />
        </Box>
        <Stack direction="column" alignItems={'center'}>
          <RegionSearchNavigation regions={regions} title="Select a country" />
          <Typography textAlign="center">
            Or <AppLink to="regions">browse all countries</AppLink>
          </Typography>
        </Stack>
      </Stack>
    </CenteredLayout>
  );
};

Component.displayName = 'LandingPage';

function DownloadsIntroText() {
  return <Typography>Some intro text here</Typography>;
}
