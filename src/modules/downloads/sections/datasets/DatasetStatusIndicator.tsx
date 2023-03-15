import { Chip, CircularProgress } from '@mui/material';
import { Boundary, ProcessorVersionMetadata } from '@nismod/irv-autopkg-client';
import { useMemo } from 'react';

import { usePackageByRegion } from '../../data/packages';

export function DatasetStatusIndicator({
  boundary,
  processorVersion: pv,
}: {
  boundary: Boundary;
  processorVersion: ProcessorVersionMetadata;
}) {
  const {
    data: pkg,
    isLoading: isStatusLoading,
    isError,
  } = usePackageByRegion({ regionId: boundary.name });
  const dataAvailable = useMemo(
    () =>
      !isStatusLoading &&
      !isError &&
      pkg.datapackage.resources.find((x) => `${x.name}.${(x as any).version}` === pv.name),
    [isStatusLoading, isError, pkg, pv],
  );

  return (
    <Chip
      sx={{ minWidth: '100px' }}
      disabled={isStatusLoading}
      color={isStatusLoading ? 'default' : dataAvailable ? 'success' : 'info'}
      label={isStatusLoading ? 'LOADING' : dataAvailable ? 'AVAILABLE' : 'PREPARE'}
      icon={isStatusLoading ? <CircularProgress size="1rem" /> : null}
    />
  );
}
