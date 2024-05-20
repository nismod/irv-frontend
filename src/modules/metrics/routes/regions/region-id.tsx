import { Stack, Typography } from '@mui/material';
import { Boundary, Processor } from '@nismod/irv-autopkg-client';
import { MultiPolygon, Polygon } from 'geojson';
import { defer, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

import { RegionMap } from '../../components/RegionMap';
import { fetchAllDatasets } from '../../data/datasets';
import { fetchRegionById } from '../../data/regions';

export const loader = async ({ request: { signal }, params: { regionId } }: LoaderFunctionArgs) => {
  return defer({
    region: await fetchRegionById({ regionId }, signal),
    datasets: fetchAllDatasets({}, signal),
  });
};

loader.displayName = 'singleRegionLoader';

type SingleRegionLoaderData = {
  region: Boundary;
  datasets: Promise<Processor[]>;
};

export const Component = () => {
  const { region } = useLoaderData() as SingleRegionLoaderData;

  return (
    <Stack direction="column" gap={5} alignItems={'center'} paddingBottom={20}>
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

      <BackLink>&larr; Back</BackLink>
      <Stack width="100%" maxWidth={'800px'}>
        <Typography variant="h2">{region.name_long}</Typography>
        <RegionMap
          regionGeometry={region.geometry as MultiPolygon}
          regionEnvelope={region.envelope as Polygon}
          width="100%"
          height={300}
        />
      </Stack>
    </Stack>
  );
};

Component.displayName = 'SingleRegionPage';
