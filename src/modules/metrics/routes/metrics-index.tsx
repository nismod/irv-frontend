import { Stack, Typography } from '@mui/material';
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
    // <CenteredLayout>
    <Stack direction="column" gap={5}>
      <Stack direction="column" width="100%" padding="0px">
        {/* <HeadingBox /> */}

        <div
          style={{
            height: '16rem',
            backgroundImage:
              "url('/irma-2017_data-from-nasa-modis_processed-by-antti-lipponen_1280.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        >
          <Stack
            padding={2}
            paddingX={4}
            justifyContent="center"
            alignItems="center"
            sx={{
              position: 'absolute',
              'background-color': 'rgba(255,255,255,0.6)',
              top: '11.2rem',
              right: '0px',
              // height: 'inherit',
              width: 'inherit',
            }}
            // position={'absolute'}
            // sx={{"bottom": "5px" }}
            // bottom={'5px'}
            // right={'5px'}
          >
            <Typography variant="h2">Explore risk metrics by country</Typography>
          </Stack>
        </div>

        <Stack
          padding={6}
          justifyContent="center"
          alignItems="center"
          sx={{ 'background-color': '#EAEAE4' }}
        >
          <Stack maxWidth={600}>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="column">
        <Stack direction="column" alignItems={'center'}>
          <RegionSearchNavigation regions={regions} title="Select a country" />
          <Typography textAlign="center">
            Or <AppLink to="regions">browse all countries</AppLink>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
    // </CenteredLayout>
  );
};

Component.displayName = 'LandingPage';
