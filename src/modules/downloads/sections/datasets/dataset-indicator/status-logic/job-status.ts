import { JobProgress } from '@nismod/irv-autopkg-client';

/**
 * Backend (Celery) job/job-group status values
 * https://docs.celeryq.dev/en/latest/userguide/tasks.html#built-in-states
 * EXECUTING is a custom state added to our backend
 */
export type BackendJobStatus =
  | 'PENDING'
  | 'STARTED'
  | 'EXECUTING'
  | 'SUCCESS'
  | 'FAILURE'
  | 'RETRY'
  | 'REVOKED';

export type JobResult = any;

export enum JobStatusType {
  Queued = 'queued',
  Processing = 'processing',
  Failed = 'failed',
  Success = 'success',
}

export type ComputeJobStatusResult =
  | {
      status: JobStatusType.Queued | JobStatusType.Failed;
      data: null;
    }
  | {
      status: JobStatusType.Processing | JobStatusType.Success;
      data: IJobStatus;
    };

/**
 * Interface defining the fields that are relevant to computing job status
 * Should be a subtree of API Client `JobStatus` schema
 */
export interface IJobStatus {
  processor_name: string;
  job_status: string;
  job_progress?: JobProgress;
  job_result?: any;
}

/**
 * Interface defining the fields that are relevant to computing job group status
 * Should be a subtree of API Client `JobGroupStatus` schema
 */
export interface IJobGroupStatus {
  job_group_processors: IJobStatus[];
}

export function computeJobStatus(
  jobGroupStatus: IJobGroupStatus,
  pvFullName: string,
): ComputeJobStatusResult {
  const pvJob = jobGroupStatus.job_group_processors.find((j) => j.processor_name === pvFullName);

  const status: BackendJobStatus | null = pvJob?.job_status as BackendJobStatus;

  if (pvJob == null || status === 'PENDING') {
    return {
      status: JobStatusType.Queued,
      data: null,
    };
  }

  if (['STARTED', 'EXECUTING', 'RETRY'].includes(status)) {
    return {
      status: JobStatusType.Processing,
      data: pvJob,
    };
  }

  if (['FAILURE', 'REVOKED'].includes(status)) {
    return {
      status: JobStatusType.Failed,
      data: null,
    };
  }

  if (status === 'SUCCESS') {
    return {
      status: JobStatusType.Success,
      data: pvJob,
    };
  }
}
