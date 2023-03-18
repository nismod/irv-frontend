import { Box, Container, Stack, Typography } from '@mui/material';
import { BoundarySummary } from '@nismod/irv-autopkg-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

import { AppLink } from '@/lib/nav';
import { LoaderData } from '@/lib/react/react-router';

import { RegionSearch } from '../components/RegionSearch';
import { ResponsiveProgress } from '../components/ResponsiveProgress';
import { fetchAllRegions } from '../data/regions';

export const loader = async ({ request: { signal } }: LoaderFunctionArgs) => ({
  regions: await fetchAllRegions({}, signal),
});

loader.displayName = 'landingPageLoader';

export type LandingPageData = LoaderData<typeof loader>;

export const Component = () => {
  const { regions } = useLoaderData() as LandingPageData;

  return (
    <Container>
      <Stack direction="column" alignItems="center">
        <Box p={2}>
          <DownloadsIntroText />
        </Box>
        <Box p={2}>
          <Box p={1}>
            <RegionSection regions={regions} />
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};

Component.displayName = 'LandingPage';

function DownloadsIntroText() {
  return <Typography>Some intro text here</Typography>;
}

function RegionSection({ regions }: Pick<LandingPageData, 'regions'>) {
  const navigate = useNavigate();

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
            state: { from: '/downloads' },
          });
        }
      }, 500);
    }
  }, [selectedRegion, selectedRegionRef, navigate]);

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
      <Typography textAlign="center">
        Or <AppLink to="regions">browse all countries</AppLink>
      </Typography>
    </Stack>
  );
}
