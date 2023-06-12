import { BoundarySummary } from '@nismod/irv-autopkg-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RegionSearch } from '../components/RegionSearch';
import { ResponsiveProgress } from '../components/ResponsiveProgress';

export function RegionSearchNavigation({
  regions,
  title,
}: {
  regions: BoundarySummary[];
  title: string;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedRegion, setSelectedRegion] = useState<BoundarySummary>(null);
  const selectedRegionRef = useRef<BoundarySummary>(null);

  const handleRegionSelected = useCallback((reg: BoundarySummary) => {
    setSelectedRegion(reg);
    selectedRegionRef.current = reg;
  }, []);

  useEffect(() => {
    if (selectedRegion != null) {
      setTimeout(() => {
        if (selectedRegionRef.current != null) {
          navigate(`/downloads/regions/${selectedRegionRef.current.name}`, {
            state: { from: pathname },
          });
        }
      }, 500);
    }
  }, [selectedRegion, selectedRegionRef, navigate, pathname]);

  return (
    <RegionSearch
      regions={regions}
      selectedRegion={selectedRegion}
      onSelectedRegion={handleRegionSelected}
      title={title}
      icon={selectedRegion && <ResponsiveProgress color="inherit" />}
    />
  );
}
