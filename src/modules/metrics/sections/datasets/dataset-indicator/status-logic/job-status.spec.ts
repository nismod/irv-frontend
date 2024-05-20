/**
 *
 * - ignore job_group_status altogether, look at job_status only
 * - when a processor is expected to exist in the job group but isn't there, assume PENDING
 * - the rest is according to Celery status list:
 * - EXECUTING and RETRY - data is being processed, can query job_progress
 * - PENDING - data is queued for processing
 * - FAILURE and REVOKED - processing failed and needs to be requested again if the users wants that
 * - SKIPPED - job was skipped because there was another job for that processor. Wait until that completes
 * - SUCCESS - processing succeeded, data should be available in /packages
 */

import { JobStateEnum } from '@nismod/irv-autopkg-client';
import { beforeEach, describe, expect, it } from 'vitest';

import { computeJobStatus, IJobGroupStatus, IJobStatus, JobStatusType } from './job-status';

function makeAnotherProcessorJob(pvName: string): IJobStatus {
  return {
    processor_name: pvName,
    job_status: JobStateEnum.EXECUTING,
    job_progress: {
      current_task: 'something',
      percent_complete: 50,
    },
    job_result: null,
  };
}

describe('Compute state of job group status data', () => {
  const PV_NAME = 'processor.version';

  // a job for a different processor - check that it doesn't affect the computation for our processor
  let SOME_OTHER_JOB: IJobStatus;

  beforeEach(() => {
    SOME_OTHER_JOB = makeAnotherProcessorJob(PV_NAME + '_not');
  });

  it('returns status:queued and no data for job_status PENDING', () => {
    const PENDING_JOB: IJobGroupStatus = {
      job_group_processors: [
        SOME_OTHER_JOB,
        {
          job_status: JobStateEnum.PENDING,
          processor_name: PV_NAME,
          job_progress: null,
          job_result: null,
        },
      ],
    };

    const { status, data } = computeJobStatus(PENDING_JOB, PV_NAME);

    expect(status).toBe(JobStatusType.Queued);
    expect(data).toBe(null);
  });

  it('returns status:queued and no data if processor expected to exist in job_group but not found by name', () => {
    const PROCESSOR_NOT_FOUND: IJobGroupStatus = {
      job_group_processors: [
        SOME_OTHER_JOB,
        {
          job_status: JobStateEnum.PENDING,
          processor_name: 'Some text not equal to processor name',
          job_progress: null,
          job_result: null,
        },
      ],
    };

    const { status, data } = computeJobStatus(PROCESSOR_NOT_FOUND, PV_NAME);

    expect(status).toBe(JobStatusType.Queued);
    expect(data).toBe(null);
  });

  it.each([JobStateEnum.EXECUTING, JobStateEnum.RETRY])(
    'returns status:processing and job data for job_status EXECUTING and RETRY',
    (job_status: JobStateEnum) => {
      const JOB = {
        processor_name: PV_NAME,
        job_status,
        job_progress: {
          current_task: 'Reticulating splines',
          percent_complete: 10,
        },
        job_result: null,
      };

      const RUNNING_JOB: IJobGroupStatus = {
        job_group_processors: [SOME_OTHER_JOB, JOB],
      };

      const { status, data } = computeJobStatus(RUNNING_JOB, PV_NAME);

      expect(status).toBe(JobStatusType.Processing);
      expect(data).toBe(JOB);
    },
  );

  it.each([JobStateEnum.FAILURE, JobStateEnum.REVOKED])(
    'returns status:failed for job_status FAILURE and REVOKED',
    (job_status: JobStateEnum) => {
      const STOPPED_JOB: IJobGroupStatus = {
        job_group_processors: [
          SOME_OTHER_JOB,
          {
            processor_name: PV_NAME,
            job_status,
            job_progress: null,
            job_result: null,
          },
        ],
      };

      const { status, data } = computeJobStatus(STOPPED_JOB, PV_NAME);

      expect(status).toBe(JobStatusType.Failed);
      expect(data).toBe(null);
    },
  );

  it('returns status:skipped and no data for job_status SKIPPED', () => {
    const SKIPPED_JOB: IJobGroupStatus = {
      job_group_processors: [
        SOME_OTHER_JOB,
        {
          processor_name: PV_NAME,
          job_status: JobStateEnum.SKIPPED,
          job_progress: null,
          job_result: {},
        },
      ],
    };

    const { status, data } = computeJobStatus(SKIPPED_JOB, PV_NAME);

    expect(status).toBe(JobStatusType.Skipped);
    expect(data).toBe(null);
  });

  it('returns status:success and job data for job_status SUCCESS', () => {
    const JOB = {
      processor_name: PV_NAME,
      job_status: JobStateEnum.SUCCESS,
      job_progress: null,
      job_result: {},
    };

    const SUCCESSFUL_JOB: IJobGroupStatus = {
      job_group_processors: [SOME_OTHER_JOB, JOB],
    };

    const { status, data } = computeJobStatus(SUCCESSFUL_JOB, PV_NAME);

    expect(status).toBe(JobStatusType.Success);
    expect(data).toBe(JOB);
  });
});
