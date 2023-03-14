import { Container, List, Skeleton, Stack } from '@mui/material';
import { Boundary, Package, Processor } from '@nismod/irv-autopkg-client';
import { range } from 'lodash';
import { Suspense } from 'react';
import { Await, LoaderFunctionArgs, defer, useLoaderData } from 'react-router-dom';

import { BackLink } from '@/lib/nav';

import { DataProcessorItem } from '../components/DataProcessorItem';
import { RegionMap } from '../components/RegionMap';
import { fetchAllDatasets } from '../data/datasets';
import { fetchPackageByRegion } from '../data/packages';
import { fetchRegionById } from '../data/regions';

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

  function renderDatasets(datasets: Processor[]) {
    return (
      <>
        <List sx={{ width: '100%', maxWidth: 360 }}>
          {datasets.map((ds) => (
            <Suspense
              key={ds.name}
              fallback={<DataProcessorItem processor={ds} pkg={null} packageLoading={true} />}
            >
              <Await
                resolve={pkg}
                errorElement={
                  <DataProcessorItem processor={ds} pkg={null} packageLoading={false} />
                }
                children={(resolvedPackage) => (
                  <DataProcessorItem processor={ds} pkg={resolvedPackage} packageLoading={false} />
                )}
              />
            </Suspense>
          ))}
        </List>
      </>
    );
  }

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
      <Suspense fallback={<Skeleton variant="rectangular" height={600} width={500} />}>
        <Await
          resolve={pkg}
          errorElement={'No package generated so far.'}
          children={(resPkg) => (
            <>
              <p>{resPkg.uri}</p>
              <pre style={{ maxWidth: '700px', maxHeight: '600px', overflowY: 'scroll' }}>
                {JSON.stringify(resPkg.datapackage, null, 4)}
              </pre>
            </>
          )}
        />
      </Suspense>
      <h2>Datasets</h2>
      <Suspense fallback={<DatasetsSkeleton />}>
        <Await resolve={datasets} children={renderDatasets} />
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
