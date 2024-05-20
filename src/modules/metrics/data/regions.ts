import { autopkgClient, cancelOnAbort } from '@/api-client';
import { makeQueryAndPrefetch } from '@/query-client';

export const [useAllRegions, fetchAllRegions] = makeQueryAndPrefetch(
  () => 'AllRegions',
  () =>
    ({ signal }) =>
      cancelOnAbort(autopkgClient.boundaries.getAllBoundarySummariesV1BoundariesGet(), signal),
);

export const [useRegionById, fetchRegionById] = makeQueryAndPrefetch(
  ({ regionId }: { regionId: string }) => ['RegionById', regionId],
  ({ regionId }) =>
    ({ signal }) =>
      cancelOnAbort(
        autopkgClient.boundaries.getBoundaryByNameV1BoundariesNameGet({ name: regionId }),
        signal,
      ),
);
