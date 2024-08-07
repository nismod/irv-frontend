import { ArgumentsType, describe, expect, it } from 'vitest';

import { computeDatasetStatus, DatasetStatus, JobQueryStatus } from './dataset-status';
import { JobStatusType } from './job-status';
import { PackageDataStatus } from './package-data';
import { QueryResultStatus } from './query-status';

type ComputeStatusArgs = ArgumentsType<typeof computeDatasetStatus>;

describe('compute dataset status', () => {
  it.each<ComputeStatusArgs>([
    // job loading
    [QueryResultStatus.Loading, QueryResultStatus.Loading],
    [QueryResultStatus.Loading, QueryResultStatus.QueryError],
    [QueryResultStatus.Loading, PackageDataStatus.Unavailable],
    [QueryResultStatus.Loading, PackageDataStatus.Available],
    // package loading
    [QueryResultStatus.Idle, QueryResultStatus.Loading],
    [QueryResultStatus.QueryError, QueryResultStatus.Loading],
    [JobStatusType.Queued, QueryResultStatus.Loading],
    [JobStatusType.Processing, QueryResultStatus.Loading],
    [JobStatusType.Failed, QueryResultStatus.Loading],
    [JobStatusType.Skipped, QueryResultStatus.Loading],
    [JobStatusType.Success, QueryResultStatus.Loading],
  ])('returns status:loading if any query is loading', (jobStatus, pkgStatus) => {
    const status = computeDatasetStatus(jobStatus, pkgStatus);

    expect(status).toBe(QueryResultStatus.Loading);
  });

  it.each([
    QueryResultStatus.Idle,
    QueryResultStatus.Loading,
    QueryResultStatus.QueryError,
    JobStatusType.Queued,
    JobStatusType.Processing,
    JobStatusType.Failed,
    JobStatusType.Skipped,
    JobStatusType.Success,
  ])('throws if package query is idle', (jobStatus: JobQueryStatus) => {
    expect(() => {
      computeDatasetStatus(jobStatus, QueryResultStatus.Idle);
    }).toThrow();
  });

  it('returns status:processing-failed when package query failed and no job query', () => {
    const status = computeDatasetStatus(QueryResultStatus.Idle, QueryResultStatus.QueryError);
    expect(status).toBe(DatasetStatus.ProcessingFailed);
  });

  it('returns status:processing-failed when both queries failed', () => {
    const status = computeDatasetStatus(QueryResultStatus.QueryError, QueryResultStatus.QueryError);
    expect(status).toBe(DatasetStatus.ProcessingFailed);
  });

  it('returns status:processing-failed when job succeeded but package query errored', () => {
    const status = computeDatasetStatus(JobStatusType.Success, QueryResultStatus.QueryError);
    expect(status).toBe(DatasetStatus.ProcessingFailed);
  });

  it('returns status:processing-failed when job succeeded but package data is not yet available', () => {
    const status = computeDatasetStatus(JobStatusType.Success, PackageDataStatus.Unavailable);
    expect(status).toBe(DatasetStatus.ProcessingFailed);
  });

  it('returns status:processing-failed when job query failed and package unavailable', () => {
    const status = computeDatasetStatus(
      QueryResultStatus.QueryError,
      PackageDataStatus.Unavailable,
    );
    expect(status).toBe(DatasetStatus.ProcessingFailed);
  });

  it('returns status:processing-failed when no data and no job', () => {
    const status = computeDatasetStatus(QueryResultStatus.Idle, PackageDataStatus.Unavailable);

    expect(status).toBe(DatasetStatus.ProcessingFailed);
  });

  it.each([
    QueryResultStatus.Idle,
    QueryResultStatus.QueryError,
    JobStatusType.Queued,
    JobStatusType.Processing,
    JobStatusType.Failed,
    JobStatusType.Skipped,
    JobStatusType.Success,
  ] as const)('returns status: ready when package available and job not loading', (jobStatus) => {
    const status = computeDatasetStatus(jobStatus, PackageDataStatus.Available);
    expect(status).toBe(DatasetStatus.Ready);
  });

  it.each([QueryResultStatus.QueryError, PackageDataStatus.Unavailable] as const)(
    'returns status:queued when job is queued and package query errored or data is unavailable',
    (packageStatus) => {
      const status = computeDatasetStatus(JobStatusType.Queued, packageStatus);
      expect(status).toBe(DatasetStatus.ProcessingFailed);
    },
  );

  it.each([QueryResultStatus.QueryError, PackageDataStatus.Unavailable])(
    'returns status:processing-failed when job is processing and package query errored or data is unavailable',
    (packageStatus) => {
      const status = computeDatasetStatus(JobStatusType.Processing, packageStatus);
      expect(status).toBe(DatasetStatus.ProcessingFailed);
    },
  );

  it.each([QueryResultStatus.QueryError, PackageDataStatus.Unavailable])(
    'returns status:processing-failed when job is skipped and package query errored or data is unavailable',
    (packageStatus) => {
      const status = computeDatasetStatus(JobStatusType.Skipped, packageStatus);
      expect(status).toBe(DatasetStatus.ProcessingFailed);
    },
  );

  it.each([QueryResultStatus.QueryError, PackageDataStatus.Unavailable])(
    'returns status:processing-failed when job processing failed and package query errored or data is unavailable',
    (packageStatus) => {
      const status = computeDatasetStatus(JobStatusType.Failed, packageStatus);
      expect(status).toBe(DatasetStatus.ProcessingFailed);
    },
  );
});
