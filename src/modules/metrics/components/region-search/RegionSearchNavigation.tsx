import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { CountryOption } from '../../types/CountryOption';
import { RegionSearch } from './RegionSearch';

export function RegionSearchNavigation({
  regions,
  title,
  metricId,
  selectedRegionSummary = null,
}: {
  regions: CountryOption[];
  title: string;
  metricId: string;
  selectedRegionSummary?: CountryOption;
}) {
  const navigate = useNavigate();

  const handleRegionSelected = useCallback(
    (country: CountryOption) => {
      if (country != null) {
        setTimeout(() => {
          navigate(
            `/metrics/regions/${country.code}/${metricId}`,
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
