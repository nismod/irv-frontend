import { autopkgClient, cancelOnAbort } from '@/api-client';
import { makeQueryAndPrefetch } from '@/query-client';

export const [useAllDatasets, fetchAllDatasets] = makeQueryAndPrefetch(
  () => ['AllDatasets'],
  () =>
    ({ signal }) =>
      cancelOnAbort(autopkgClient.processors.getProcessorsV1ProcessorsGet(), signal),
);
