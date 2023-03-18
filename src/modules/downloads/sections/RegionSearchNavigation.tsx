import { Box, Stack, Typography } from '@mui/material';
import { BoundarySummary } from '@nismod/irv-autopkg-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RegionSearch } from '../components/RegionSearch';
import { ResponsiveProgress } from '../components/ResponsiveProgress';

export function RegionSearchNavigation({ regions }: { regions: BoundarySummary[] }) {
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
    <Stack direction="column">
      <Box width="200px">
        <RegionSearch
          regions={regions}
          selectedRegion={selectedRegion}
          onSelectedRegion={handleRegionSelected}
        />
      </Box>
      <Box>
        {selectedRegion && (
          <Typography>
            <ResponsiveProgress color="inherit" /> Loading country data...
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
