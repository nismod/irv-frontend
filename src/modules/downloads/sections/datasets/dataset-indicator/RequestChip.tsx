import { BoundarySummary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { FC, useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useRecoilCallback } from 'recoil';

import { usePrevious } from '@/lib/hooks/use-previous';

import { SavedJob, submitJob, submittedJobsState } from '../../../data/jobs';
import { StyledChip } from './dataset-chips';
import { DatasetStatus } from './status-logic/dataset-status';

function useSubmitJob() {
  const saveSubmittedJob = useRecoilCallback(({ set }) => (job: SavedJob) => {
    set(submittedJobsState, (oldVal) => [...oldVal, job]);
  });

  const { mutate, variables, data, isSuccess } = useMutation(
    ({ boundaryName, pvName }: { boundaryName: string; pvName: string }) =>
      submitJob(boundaryName, [pvName]),
  );
  const previousSuccess = usePrevious(isSuccess);

  useEffect(() => {
    if (isSuccess && !previousSuccess) {
      const { job_id } = data;
      const { boundaryName, pvName } = variables;

      saveSubmittedJob({ jobId: job_id, boundaryName, processors: [pvName], inserted: new Date() });
    }
  }, [isSuccess, previousSuccess, data, variables, saveSubmittedJob]);

  return useCallback(
    (boundaryName: string, pvName: string) => {
      mutate({ boundaryName, pvName });
    },
    [mutate],
  );
}

export const RequestChip: FC<{
  status: DatasetStatus.Prepare | DatasetStatus.ProcessingFailed;
  boundary: BoundarySummary;
  pv: ProcessorVersionMetadata;
}> = ({ status, boundary, pv }) => {
  const previousFailed = status === DatasetStatus.ProcessingFailed;

  const [disabled, setDisabled] = useState(false);

  const submitJob = useSubmitJob();

  const handleSubmitJob = useCallback(() => {
    submitJob(boundary.name, pv.name);
    setDisabled(true); // disable to prevent submitting twice
  }, [boundary.name, pv.name, submitJob]);

  return (
    <StyledChip
      disabled={disabled}
      color={previousFailed ? 'error' : 'info'}
      title={
        previousFailed
          ? `The processing failed. Request ${pv.data_title} again.`
          : `Request ${pv.data_title}`
      }
      label={previousFailed ? 'FAILED' : 'PREPARE'}
      onClick={(e) => {
        handleSubmitJob();
        e.stopPropagation();
      }}
    />
  );
};
