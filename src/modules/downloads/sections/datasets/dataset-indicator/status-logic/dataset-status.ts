import { inlist } from '@/lib/helpers';

import { ComputeJobStatusResult, JobStatusType } from './job-status';
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

  if (pkgStat === PackageDataStatus.Unavailable && jobStat === JobStatusType.Success) {
    return DatasetStatus.ProcessingSuccess;
  }

  if (pkgStat === PackageDataStatus.Unavailable && jobStat === QueryResultStatus.Idle) {
    return DatasetStatus.Prepare;
  }

  if (inlist(pkgStat, [QueryResultStatus.QueryError, PackageDataStatus.Unavailable])) {
    if (jobStat === JobStatusType.Queued) {
      return DatasetStatus.Queued;
    }

    if (jobStat === JobStatusType.Processing) {
      return DatasetStatus.Processing;
    }

    if (jobStat === JobStatusType.Skipped) {
      return DatasetStatus.ProcessingSkipped;
    }

    if (jobStat === JobStatusType.Failed) {
      return DatasetStatus.ProcessingFailed;
    }
  }

  /*
  // don't need to check these conditions separately, all the rest is Unknown
  if (
    (jobStat === QueryResultStatus.QueryError &&
      inlist(pkgStat, [QueryResultStatus.QueryError, PackageDataStatus.Unavailable])) ||
    (pkgStat === QueryResultStatus.QueryError &&
      inlist(jobStat, [QueryResultStatus.QueryError, QueryResultStatus.Idle]))
  ) {
    return DatasetStatus.Unknown;
  }
  */

  return DatasetStatus.Unknown;
}
