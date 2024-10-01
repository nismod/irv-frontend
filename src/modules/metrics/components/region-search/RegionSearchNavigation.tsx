import { BoundarySummary } from '@nismod/irv-autopkg-client';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegionSearch } from './RegionSearch';

export function RegionSearchNavigation({
  regions,
  title,
  metricId,
  selectedRegionSummary = null,
}: {
  regions: BoundarySummary[];
  title: string;
  metricId: string;
  selectedRegionSummary?: BoundarySummary;
}) {
  const navigate = useNavigate();

  const handleRegionSelected = useCallback(
    (reg: BoundarySummary) => {
      if (reg != null) {
        setTimeout(() => {
          navigate(
            `/metrics/regions/${reg.name}/${metricId}`,
            { preventScrollReset: true }, // don't scroll to top on navigate
          );
        }, 100);
      }
    },
    [metricId, navigate],
  );

  return (
    <RegionSearch
      regions={regions}
      selectedRegion={selectedRegionSummary}
      onSelectedRegion={handleRegionSelected}
      title={title}
      icon={null}
    />
  );
}
