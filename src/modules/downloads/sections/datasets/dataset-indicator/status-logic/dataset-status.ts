import { ComputePackageDataResult, PackageDataStatus } from './package-data';
import { QueryResultStatus, QueryStatusResult } from './query-status';

export type PackageQueryStatus = QueryStatusResult<ComputePackageDataResult>['status'];

export enum DatasetStatus {
  Loading = 'loading',
  Unknown = 'unknown',
  Unavailable = 'unavailable',
  Ready = 'ready',
}

export function computeDatasetStatus(pkgStat: PackageQueryStatus): DatasetStatus {
  if (pkgStat === QueryResultStatus.Idle) {
    throw new Error('Not expecting package query to not be loaded');
  }
  if (pkgStat === QueryResultStatus.Loading) {
    return DatasetStatus.Loading;
  }
  if (pkgStat === QueryResultStatus.QueryError) {
    return DatasetStatus.Unknown;
  }
  if (pkgStat === PackageDataStatus.Available) {
    return DatasetStatus.Ready;
  }
  return DatasetStatus.Unavailable;
}
