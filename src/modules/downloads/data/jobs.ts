import { Job } from '@nismod/irv-autopkg-client';
import { array, date, object, string } from '@recoiljs/refine';
import _ from 'lodash';
import { TransactionInterface_UNSTABLE, atom, selectorFamily } from 'recoil';
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
  return autopkgClient.jobs.submitProcessingJobV1JobsPost({
    requestBody: { boundary_name: boundaryName, processors },
  });
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
