import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';

import { inlist } from '@/lib/helpers';

import { usePackageData } from '../use-package-data';
import { InfoChip } from './dataset-chips';
import { DownloadChip } from './DownloadChip';
import { RequestChip } from './RequestChip';
import { computeDatasetStatus, DatasetStatus } from './status-logic/dataset-status';

export function DatasetStatusIndicator({
  boundary,
  processorVersion: pv,
  onGoToDownload,
}: {
  boundary: Boundary;
  processorVersion: ProcessorVersionMetadata;
  onGoToDownload: () => void;
}) {
  const { status: packageStatus, data: dataResource } = usePackageData(boundary.name, pv.name);
  const dataStatus = computeDatasetStatus(packageStatus);

  if (inlist(dataStatus, [DatasetStatus.Loading, DatasetStatus.Unknown])) {
    return <InfoChip status={dataStatus} />;
  }

  if (dataStatus === DatasetStatus.Unavailable) {
    return <RequestChip />;
  }

  if (dataStatus === DatasetStatus.Ready) {
    return <DownloadChip resource={dataResource} pv={pv} onGoToDownload={onGoToDownload} />;
  }
}
