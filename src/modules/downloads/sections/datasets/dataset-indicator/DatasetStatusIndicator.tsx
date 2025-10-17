import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { inlist } from '@/lib/helpers';
import { useObjectMemo } from '@/lib/hooks/use-object-memo';

import {
  lastSubmittedJobByParamsState,
  SavedJob,
  useJobById,
  useMoveJobToCompleted,
} from '../../../data/jobs';
import { fetchPackageByRegion } from '../../../data/packages';
import { usePackageData } from '../use-package-data';
import { InfoChip, ProcessingInfoChip, SuccessChip } from './dataset-chips';
import { DownloadChip } from './DownloadChip';
import { RequestChip } from './RequestChip';
import { computeDatasetStatus, DatasetStatus } from './status-logic/dataset-status';
import { computeJobStatus, ComputeJobStatusResult, JobStatusType } from './status-logic/job-status';
import { ComputePackageDataResult, PackageDataStatus } from './status-logic/package-data';
import { computeQueryStatus, QueryStatusResult } from './status-logic/query-status';

export function DatasetStatusIndicator({
  boundary,
  processorVersion: pv,
  onGoToDownload,
}: {
  boundary: Boundary;
  processorVersion: ProcessorVersionMetadata;
  onGoToDownload: () => void;
}) {
  const pvFullName = pv.name;

  const [jobRefetchInterval, setJobRefetchInterval] = useState(2_000);

  const { status: packageStatus, data: dataResource } = usePackageData(boundary.name, pvFullName);

  const lastJob = useLastSubmittedJob(boundary.name, pvFullName);
  const jobResult = useSubmittedJobData(lastJob, pvFullName, jobRefetchInterval);
  const { status: jobStatus, data: jobData } = jobResult;

  const dataStatus = computeDatasetStatus(jobStatus, packageStatus);

  useEffect(() => {
    let nextInterval = 2_000;

    if (inlist(jobStatus, [JobStatusType.Skipped, JobStatusType.Success])) {
      // slow down querying after job successful
      nextInterval = 10_000;
    } else if (jobStatus === JobStatusType.Failed) {
      // turn off refetching for failed jobs
      nextInterval = 0;
    }

    startTransition(() => {
      setJobRefetchInterval(nextInterval);
    });
  }, [jobStatus]);

  useRefetchPackageUponComplete(dataStatus, boundary.name);
  useCompleteJob(lastJob, jobResult, packageStatus, boundary.name);

  if (inlist(dataStatus, [DatasetStatus.Loading, DatasetStatus.Unknown])) {
    return <InfoChip status={dataStatus} />;
  }

  if (inlist(dataStatus, [DatasetStatus.Queued, DatasetStatus.Processing])) {
    return <ProcessingInfoChip status={dataStatus} progress={jobData?.job_progress} />;
  }

  if (inlist(dataStatus, [DatasetStatus.ProcessingSkipped, DatasetStatus.ProcessingSuccess])) {
    return <SuccessChip status={dataStatus} />;
  }

  if (inlist(dataStatus, [DatasetStatus.Prepare, DatasetStatus.ProcessingFailed])) {
    return <RequestChip status={dataStatus} boundary={boundary} pv={pv} />;
  }

  if (dataStatus === DatasetStatus.Ready) {
    return <DownloadChip resource={dataResource} pv={pv} onGoToDownload={onGoToDownload} />;
  }
}

function useLastSubmittedJob(boundaryName: string, pvName: string) {
  const lastSubmittedJob = useRecoilValue(
    lastSubmittedJobByParamsState({ boundaryName: boundaryName, processorVersion: pvName }),
  );

  return lastSubmittedJob;
}

function useSubmittedJobData(job: SavedJob | null, pvName: string, refetchInterval = 10_000) {
  const { status, fetchStatus, data, error } = useJobById(
    { jobId: job?.jobId },
    { enabled: job != null, refetchInterval },
  );
  const jobQueryObj = useObjectMemo({ status, fetchStatus, data, error });

  const jobResult = useMemo(
    () => computeQueryStatus(jobQueryObj, pvName, computeJobStatus),
    [jobQueryObj, pvName],
  );

  return jobResult;
}

function useRefetchPackageUponComplete(dataStatus: DatasetStatus, boundaryName: string) {
  useEffect(() => {
    if (inlist(dataStatus, [DatasetStatus.ProcessingSkipped, DatasetStatus.ProcessingSuccess])) {
      const doRefetch = () => {
        fetchPackageByRegion({ regionId: boundaryName });
      };

      doRefetch();
      const intervalId = setInterval(doRefetch, 10_000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [dataStatus, boundaryName]);
}

function useCompleteJob(
  job: SavedJob,
  jobResult: QueryStatusResult<ComputeJobStatusResult>,
  packageStatus: QueryStatusResult<ComputePackageDataResult>['status'],
  boundaryName: string,
) {
  const completeJob = useMoveJobToCompleted();

  const jobId = job?.jobId;
  const jobStatus = jobResult.status;

  useEffect(() => {
    if (
      jobId != null &&
      packageStatus === PackageDataStatus.Available &&
      inlist(jobStatus, [JobStatusType.Success, JobStatusType.Failed, JobStatusType.Skipped])
    ) {
      const timerId = setTimeout(() => {
        completeJob(jobId);
      }, 5_000);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [boundaryName, completeJob, jobId, jobStatus, packageStatus]);
}
