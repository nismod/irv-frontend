import { JobProgress, JobStateEnum } from '@nismod/irv-autopkg-client';

export type JobResult = any;

export enum JobStatusType {
  Queued = 'queued',
  Processing = 'processing',
  Failed = 'failed',
  Skipped = 'skipped',
  Success = 'success',
}

export type ComputeJobStatusResult =
  | {
      status: JobStatusType.Queued | JobStatusType.Failed | JobStatusType.Skipped;
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
  job_status: JobStateEnum;
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

  const status: JobStateEnum | null = pvJob?.job_status;

  if (pvJob == null || status === JobStateEnum.PENDING) {
    return {
      status: JobStatusType.Queued,
      data: null,
    };
  }

  if ([JobStateEnum.EXECUTING, JobStateEnum.RETRY].includes(status)) {
    return {
      status: JobStatusType.Processing,
      data: pvJob,
    };
  }

  if ([JobStateEnum.FAILURE, JobStateEnum.REVOKED].includes(status)) {
    return {
      status: JobStatusType.Failed,
      data: null,
    };
  }

  if (status === JobStateEnum.SKIPPED) {
    return {
      status: JobStatusType.Skipped,
      data: null,
    };
  }

  if (status === JobStateEnum.SUCCESS) {
    return {
      status: JobStatusType.Success,
      data: pvJob,
    };
  }
}
