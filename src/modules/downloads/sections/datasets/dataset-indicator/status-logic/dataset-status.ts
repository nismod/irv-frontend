import { ComputeJobStatusResult } from './job-status';
import { ComputePackageDataResult, PackageDataStatus } from './package-data';
import { QueryResultStatus, QueryStatusResult } from './query-status';

export type JobQueryStatus = QueryStatusResult<ComputeJobStatusResult>['status'];
export type PackageQueryStatus = QueryStatusResult<ComputePackageDataResult>['status'];

export enum DatasetStatus {
  Loading = 'loading', // information about the status is loading
  Unknown = 'unknown', // loading the information failed for some reason - user should refresh page / try later?
  Prepare = 'prepare', // data not ready but user can request preparing it
  Queued = 'queued', // data is queued for processing
  Processing = 'processing', // data is processing
  ProcessingFailed = 'processing-failed', // data processing failed, can request again
  ProcessingSkipped = 'processing-skipped', // data processing skipped, another job running
  ProcessingSuccess = 'processing-success', // data processing succeeded, package being uploaded
  Ready = 'ready', // data is ready for download
}

export function computeDatasetStatus(
  jobStat: JobQueryStatus,
  pkgStat: PackageQueryStatus,
): DatasetStatus {
  if (pkgStat === QueryResultStatus.Idle) {
    throw new Error('Not expecting package query to not be loaded');
  }
  if (pkgStat === QueryResultStatus.Loading || jobStat === QueryResultStatus.Loading) {
    return DatasetStatus.Loading;
  }

  if (pkgStat === PackageDataStatus.Available) {
    return DatasetStatus.Ready;
  }

  // See git history for handling full set of states
  return DatasetStatus.ProcessingFailed;
}
