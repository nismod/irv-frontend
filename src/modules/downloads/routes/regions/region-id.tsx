import { Container, Skeleton, Stack } from '@mui/material';
import { Boundary, Processor } from '@nismod/irv-autopkg-client';
import { MultiPolygon, Polygon } from 'geojson';
import { range } from 'lodash';
import { Suspense } from 'react';
import { Await, LoaderFunctionArgs, defer, useLoaderData } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

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
    <Container>
      <BackLink>&larr; Back</BackLink>
      <h2>{region.name_long}</h2>
      <RegionMap
        regionGeometry={region.geometry as MultiPolygon}
        regionEnvelope={region.envelope as Polygon}
        width={600}
        height={300}
      />
      <h2>Datasets</h2>
      <Suspense fallback={<DatasetsSkeleton />}>
        <Await
          resolve={datasets}
          children={(datasets) => <DatasetsList datasets={datasets} region={region} />}
        />
      </Suspense>
    </Container>
  );
};

Component.displayName = 'SingleRegionPage';

function DatasetsSkeleton() {
  return (
    <Stack direction="column" spacing={2}>
      {range(5).map((x) => (
        <Skeleton key={x} animation="wave" variant="rectangular" height={100} />
      ))}
    </Stack>
  );
}
