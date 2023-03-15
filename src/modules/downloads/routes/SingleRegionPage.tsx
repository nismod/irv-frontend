import { Container, Skeleton, Stack } from '@mui/material';
import { Boundary, Package, Processor } from '@nismod/irv-autopkg-client';
import { range } from 'lodash';
import { Suspense } from 'react';
import ReactJson from 'react-json-view';
import { Await, LoaderFunctionArgs, defer, useLoaderData } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

import { RegionMap } from '../components/RegionMap';
import { fetchAllDatasets } from '../data/datasets';
import { fetchPackageByRegion } from '../data/packages';
import { fetchRegionById } from '../data/regions';
import { DatasetsList } from '../sections/datasets/DatasetsList';

export const singleRegionLoader = async ({
  request: { signal },
  params: { regionId },
}: LoaderFunctionArgs) => {
  return defer({
    region: await fetchRegionById({ regionId }, signal),
    datasets: fetchAllDatasets({}, signal),
    pkg: fetchPackageByRegion({ regionId }, signal),
  });
};

type SingleRegionLoaderData = {
  region: Boundary;
  datasets: Promise<Processor[]>;
  pkg: Promise<Package>;
};

export const SingleRegionPage = () => {
  const { region, datasets, pkg } = useLoaderData() as SingleRegionLoaderData;

  return (
    <Container>
      <BackLink>&larr; Back</BackLink>
      <h2>{region.name_long}</h2>
      <RegionMap
        regionGeometry={region.geometry}
        regionEnvelope={region.envelope}
        width={600}
        height={300}
      />
      <h2>Package</h2>
      <Suspense fallback={<Skeleton variant="rectangular" height={800} width={600} />}>
        <Await
          resolve={pkg}
          errorElement={'No package generated so far.'}
          children={(resPkg: Package) => (
            <ReactJson src={resPkg} style={{ height: 800, width: 600, overflow: 'auto' }} />
          )}
        />
      </Suspense>
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

function DatasetsSkeleton() {
  return (
    <Stack direction="column" spacing={1}>
      {range(5).map((x) => (
        <Skeleton key={x} animation="wave" variant="rectangular" />
      ))}
    </Stack>
  );
}
