import { autopkgClient, cancelOnAbort } from '@/api-client';
import { makeQueryAndPrefetch } from '@/query-client';

export const [usePackageByRegion, fetchPackageByRegion] = makeQueryAndPrefetch(
  ({ regionId }: { regionId: string }) => ['PackageByRegion', regionId],
  ({ regionId }) =>
    ({ signal }) =>
      cancelOnAbort(
        autopkgClient.packages.getPackageV1PackagesBoundaryNameGet({ boundaryName: regionId }),
        signal,
      ),
);
