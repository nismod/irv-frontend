import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { Boundary, Processor } from '@nismod/irv-autopkg-client';
import { MultiPolygon, Polygon } from 'geojson';
import { range } from 'lodash';
import { Suspense } from 'react';
import { Await, defer, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

import { CenteredLayout } from '../../components/CenteredLayout';
import { RegionMap } from '../../components/RegionMap';
import { fetchAllDatasets } from '../../data/datasets';
import { fetchRegionById } from '../../data/regions';
import { DatasetsList } from '../../sections/datasets/DatasetsList';

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
  const { region, datasets } = useLoaderData() as SingleRegionLoaderData;

  return (
    <CenteredLayout>
      <BackLink>&larr; Back</BackLink>
      <Typography variant="h2">{region.name_long}</Typography>
      <RegionMap
        regionGeometry={region.geometry as MultiPolygon}
        regionEnvelope={region.envelope as Polygon}
        width="100%"
        height={300}
      />
      <Box mt={5}>
        <Typography variant="h3">Datasets</Typography>
        <Suspense fallback={<DatasetsSkeleton />}>
          <Await resolve={datasets}>
            {(datasets) => <DatasetsList datasets={datasets} region={region} />}
          </Await>
        </Suspense>
      </Box>
    </CenteredLayout>
  );
};

Component.displayName = 'SingleRegionPage';

function DatasetsSkeleton() {
  return (
    <Stack direction="column" spacing={1}>
      {range(5).map((x) => (
        <Skeleton key={x} animation="wave" variant="rectangular" height={100} />
      ))}
    </Stack>
  );
}
