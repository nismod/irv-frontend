import { ApiError, Job } from '@nismod/irv-autopkg-client';
import { array, date, object, string } from '@recoiljs/refine';
import _ from 'lodash';
import { useEffect } from 'react';
import {
  atom,
  selectorFamily,
  TransactionInterface_UNSTABLE,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
} from 'recoil';
import { syncEffect } from 'recoil-sync';
import type { CamelCasedProperties, Simplify } from 'type-fest';

import { autopkgClient, cancelOnAbort } from '@/api-client';
import { makeQueryAndPrefetch } from '@/query-client';

export const [useJobById, fetchJobById] = makeQueryAndPrefetch(
  ({ jobId }: { jobId: string }) => ['JobById', jobId],
  ({ jobId }) =>
    ({ signal }) =>
      cancelOnAbort(autopkgClient.jobs.getStatusV1JobsJobIdGet({ jobId }), signal),
);

export function submitJob(boundaryName: string, processors: string[]) {
  throw new ApiError(
    null,
    {
      url: '',
      status: 403,
      statusText: '',
      body: '',
      ok: false,
    },
    `Failed to process ${boundaryName}: ${processors}`,
  );
  // Short-circuit to avoid requesting jobs.

  // return autopkgClient.jobs.submitProcessingJobV1JobsPost({
  //   requestBody: { boundary_name: boundaryName, processors },
  // });
}

export type JobParams = CamelCasedProperties<Job>;

export type SavedJob = Simplify<
  JobParams & {
    jobId: string;
    inserted: Date;
  }
>;

const jobsArrayChecker = array(
  object({
    boundaryName: string(),
    processors: array(string()),
    jobId: string(),
    inserted: date(),
  }),
);

export const submittedJobsState = atom<SavedJob[]>({
  key: 'submittedJobs',
  default: [],
  effects: [
    syncEffect({
      storeKey: 'local-storage',
      refine: jobsArrayChecker,
      syncDefault: true,
    }),
  ],
});

export const completedJobsState = atom<SavedJob[]>({
  key: 'completedJobs',
  default: [],
  effects: [
    syncEffect({
      storeKey: 'local-storage',
      refine: jobsArrayChecker,
      syncDefault: true,
    }),
  ],
});

export const moveJobToCompletedTransaction =
  ({ get, set }: TransactionInterface_UNSTABLE) =>
  (jobId: string) => {
    const submittedJobs = get(submittedJobsState);
    const job = submittedJobs.find((j) => j.jobId === jobId);

    if (job != null) {
      const jobCopy = _.cloneDeep(job);
      jobCopy.inserted = new Date();

      set(
        submittedJobsState,
        submittedJobs.filter((j) => j.jobId !== jobId),
      );

      set(completedJobsState, (oldVal) => [jobCopy, ...oldVal]);
    }
  };

export function useMoveJobToCompleted() {
  return useRecoilTransaction_UNSTABLE(moveJobToCompletedTransaction);
}

export type SingleProcessorVersionParams = {
  boundaryName: string;
  processorVersion: string;
};

export const lastSubmittedJobByParamsState = selectorFamily<SavedJob, SingleProcessorVersionParams>(
  {
    key: 'lastSubmittedJobByParams',
    get:
      ({ boundaryName, processorVersion }) =>
      ({ get }) => {
        const allJobs = get(submittedJobsState);

        return allJobs.findLast(
          (x) => x.boundaryName === boundaryName && x.processors.includes(processorVersion),
        );
      },
  },
);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function dateDiff(d1: Date, d2: Date) {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  return utc2 - utc1;
}

/**
 * If there are submitted jobs that are more than one day old, simply remove them
 * and let the user submit a job again - this is to simplify cases where something
 * unexpected happened and the job got stuck.
 */
export function usePruneOldJobs() {
  const submittedJobs = useRecoilValue(submittedJobsState);

  const completeJob = useMoveJobToCompleted();

  useEffect(() => {
    const now = new Date();
    for (const job of submittedJobs) {
      if (dateDiff(job.inserted, now) > MS_PER_DAY) {
        completeJob(job.jobId);
      }
    }
  }, [submittedJobs, completeJob]);
}

export function usePruneJobsBeforeLast() {
  const submittedJobs = useRecoilValue(submittedJobsState);

  const completeJob = useMoveJobToCompleted();

  useEffect(() => {
    const idSet = new Set();

    const jobsReversed = [...submittedJobs];
    jobsReversed.reverse();

    for (const job of jobsReversed) {
      const key = `${job.boundaryName}@@${job.processors.join('--')}`;

      if (idSet.has(key)) {
        completeJob(job.jobId);
      } else {
        idSet.add(key);
      }
    }
  }, [submittedJobs, completeJob]);
}
