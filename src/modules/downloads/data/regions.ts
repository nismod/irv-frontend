import { autopkgClient, cancelOnAbort } from '@/api-client';
import { makeQueryAndPrefetch } from '@/query-client';

export const [useAllRegions, fetchAllRegions] = makeQueryAndPrefetch(
  () => 'AllRegions',
  () =>
    ({ signal }) =>
      cancelOnAbort(autopkgClient.boundaries.getAllBoundarySummariesV1BoundariesGet(), signal),
);

export const [useRegionById, fetchRegionById] = makeQueryAndPrefetch(
  (id: string) => ['RegionById', id],
  (id: string) =>
    ({ signal }) =>
      cancelOnAbort(
        autopkgClient.boundaries.getBoundaryByNameV1BoundariesNameGet({ name: id }),
        signal,
      ),
);
