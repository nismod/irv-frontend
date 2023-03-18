import { Boundary, JobStatus, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilTransaction_UNSTABLE, useRecoilValue } from 'recoil';

import { inlist } from '@/lib/helpers';
import { useObjectMemo } from '@/lib/hooks/use-object-memo';

import {
  lastSubmittedJobByParamsState,
  moveJobToCompletedTransaction,
  useJobById,
} from '../../../data/jobs';
import { fetchPackageByRegion, usePackageByRegion } from '../../../data/packages';
import { RequestChip } from './RequestChip';
import { DownloadChip, InfoChip, ProcessingInfoChip } from './dataset-chips';
import { DatasetStatus, computeDatasetStatus } from './status-logic/dataset-status';
import { ComputeJobStatusResult, JobStatusType, computeJobStatus } from './status-logic/job-status';
import {
  ComputePackageDataResult,
  PackageDataStatus,
  computePackageData,
} from './status-logic/package-data';
import { QueryStatusResult, computeQueryStatus } from './status-logic/query-status';

export function DatasetStatusIndicator({
  boundary,
  processorVersion: pv,
}: {
  boundary: Boundary;
  processorVersion: ProcessorVersionMetadata;
}) {
  const pvFullName = pv.name;

  const [jobRefetchInterval, setJobRefetchInterval] = useState(2_000);

  const { status: packageStatus, data: dataResource } = usePackageData(boundary.name, pvFullName);
  const jobResult = useSubmittedJobData(boundary.name, pvFullName, jobRefetchInterval);
  const { status: jobStatus, data: jobData } = jobResult;

  const dataStatus = computeDatasetStatus(jobStatus, packageStatus);

  useEffect(() => {
    // slow down querying after job successful
    if (jobStatus === JobStatusType.Success) {
      setJobRefetchInterval(20_000);
    } else {
      setJobRefetchInterval(2_000);
    }
  }, [jobStatus]);

  useRefetchPackageUponComplete(dataStatus, boundary.name);
  useCompleteJob(jobResult, packageStatus, boundary.name);

  if (inlist(dataStatus, [DatasetStatus.Loading, DatasetStatus.Unknown])) {
    return <InfoChip status={dataStatus} />;
  }

  if (
    inlist(dataStatus, [
      DatasetStatus.Queued,
      DatasetStatus.Processing,
      DatasetStatus.ProcessingSuccess,
    ])
  ) {
    return <ProcessingInfoChip status={dataStatus} progress={jobData?.job_progress} />;
  }

  if (inlist(dataStatus, [DatasetStatus.Prepare, DatasetStatus.ProcessingFailed])) {
    return <RequestChip status={dataStatus} boundary={boundary} pv={pv} />;
  }

  if (dataStatus === DatasetStatus.Ready) {
    return <DownloadChip resource={dataResource} pv={pv} />;
  }
}

function usePackageData(boundaryName: string, pvName: string) {
  const { status, error, data } = usePackageByRegion(
    {
      regionId: boundaryName,
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  );
  const packageQueryObj = useObjectMemo({ status, error, data });

  return useMemo(
    () =>
      computeQueryStatus(packageQueryObj, pvName, computePackageData, (error) => {
        if (error.status === 404) {
          return {
            status: PackageDataStatus.Unavailable,
            data: null,
          };
        }
      }),
    [packageQueryObj, pvName],
  );
}

function useSubmittedJobData(boundaryName: string, pvName: string, refetchInterval = 10_000) {
  const lastSubmittedJob = useRecoilValue(
    lastSubmittedJobByParamsState({ boundaryName: boundaryName, processorVersion: pvName }),
  );

  const { status, data, error } = useJobById(
    { jobId: lastSubmittedJob?.jobId },
    { enabled: lastSubmittedJob != null, refetchInterval },
  );
  const jobQueryObj = useObjectMemo({ status, data, error });

  const jobResult = useMemo(
    () => computeQueryStatus(jobQueryObj, pvName, computeJobStatus),
    [jobQueryObj, pvName],
  );

  return jobResult;
}

function useRefetchPackageUponComplete(dataStatus: DatasetStatus, boundaryName: string) {
  useEffect(() => {
    if (dataStatus === DatasetStatus.ProcessingSuccess) {
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
  jobResult: QueryStatusResult<ComputeJobStatusResult>,
  packageStatus: QueryStatusResult<ComputePackageDataResult>['status'],
  boundaryName: string,
) {
  const completeJob = useRecoilTransaction_UNSTABLE(moveJobToCompletedTransaction, []);

  const jobId = (jobResult.data as JobStatus)?.job_id;
  const jobStatus = jobResult.status;

  useEffect(() => {
    if (
      jobId != null &&
      packageStatus === PackageDataStatus.Available &&
      inlist(jobStatus, [JobStatusType.Success, JobStatusType.Failed])
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
