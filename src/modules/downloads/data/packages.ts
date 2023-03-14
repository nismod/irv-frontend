import { autopkgClient, cancelOnAbort } from '@/api-client';
import { makeQueryAndPrefetch } from '@/query-client';

export const [usePackageByRegion, fetchPackageByRegion] = makeQueryAndPrefetch(
  (regionId: string) => ['PackageByRegion', regionId],
  (regionId: string) =>
    ({ signal }) =>
      cancelOnAbort(
        autopkgClient.packages.getPackageV1PackagesBoundaryNameGet({ boundaryName: regionId }),
        signal,
      ),
);
