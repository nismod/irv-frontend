import { useMemo } from 'react';

import { useObjectMemo } from '@/lib/hooks/use-object-memo';

import { usePackageByRegion } from '../../data/packages';
import {
  computePackageData,
  PackageDataStatus,
} from './dataset-indicator/status-logic/package-data';
import { computeQueryStatus } from './dataset-indicator/status-logic/query-status';

export function usePackageData(boundaryName: string, pvName: string) {
  const { status, fetchStatus, error, data } = usePackageByRegion(
    {
      regionId: boundaryName,
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  );
  const packageQueryObj = useObjectMemo({ status, fetchStatus, error, data });

  return useMemo(
    () =>
      computeQueryStatus(packageQueryObj, pvName, computePackageData, (error) => {
        if (error.status === 404) {
          return {
            status: PackageDataStatus.Unavailable,
            data: null,
          };
        }
      }),
    [packageQueryObj, pvName],
  );
}
