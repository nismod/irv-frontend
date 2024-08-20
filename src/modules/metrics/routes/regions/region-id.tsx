import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { Boundary, BoundarySummary } from '@nismod/irv-autopkg-client';
import { useCallback, useEffect, useState } from 'react';
import { defer, LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { AppLink } from '@/lib/nav';

import { Footer } from '@/pages/ui/Footer';

import { Dashboard } from '../../components/dashboard/Dashboard';
import { RegionSearchNavigation } from '../../components/selection/RegionSearchNavigation';
import { RegionMetricsHeader } from './RegionMetricsHeader';
import { fetchAllRegions, fetchRegionById } from './regions';

export const loader = async ({
  request: { signal },
  params: { regionId, metricId },
}: LoaderFunctionArgs) => {
  return defer({
    region: await fetchRegionById({ regionId }, signal),
    regions: await fetchAllRegions({}, signal),
    metricId: metricId,
  });
};

loader.displayName = 'regionMetricsLoader';

type RegionMetricsLoaderData = {
  region: Boundary;
  regions: BoundarySummary[];
  metricId: string;
};

const metricOptions = [
  {
    value: 'development',
    label: 'Human Development Index',
    url: 'https://gist.githubusercontent.com/shiarella/d7cf2c2b328c89720c213bd18cf7bace/raw/1c62f7f977d344bceb26ab89e7213af303ed9ccb/gdl-development.json',
  },
  {
    value: 'healthcare',
    label: 'Healthcare Index',
    url: 'https://gist.githubusercontent.com/shiarella/5a3a7073d7b017e6c027e7113092de39/raw/dbc8c9943d0f01ccd0a2fdd2442e4577ad2c809b/gdl-health.json',
  },
  {
    value: 'education',
    label: 'Educational Index',
    url: 'https://gist.githubusercontent.com/shiarella/4453d462208a121ad7bae6411660fb3a/raw/ba250c00a98c75099adccfd8e51bc2cda8d61ce4/gdl-education.json',
  },
  {
    value: 'Income',
    label: 'Income Index',
    url: 'https://gist.githubusercontent.com/shiarella/b8b529540923e23c53252dcfd73da0d1/raw/48e1c6d105b6578c542ad665ef0de1c8dc9b3395/gdl-income.json',
  },
];

export const Component = () => {
  const { region, regions, metricId } = useLoaderData() as RegionMetricsLoaderData;

  const navigate = useNavigate();

  const [chartData, setChartData] = useState(null);
  const [scaleAcrossYears, setScaleAcrossYears] = useState(true);
  const [scaleAcrossCountries, setScaleAcrossCountries] = useState(false);

  const maybeMetricSelection = metricOptions.find((option) => option.value === metricId);
  const metricSelection = maybeMetricSelection ? maybeMetricSelection : metricOptions[0];
  const selectedMetricId = metricSelection.value;

  const handleMetricSelection = useCallback(
    (selection: String) => {
      const maybeMetricMatch = metricOptions.find((option) => option.value === selection);
      const selectionId = maybeMetricMatch ? maybeMetricMatch.value : metricOptions[0].value;
      if (selection != null) {
        setTimeout(() => {
          navigate(
            `/metrics/regions/${region.name}/${selectionId}`,
            { preventScrollReset: true }, // don't scroll to top on navigate
          );
        }, 100);
      }
    },
    [navigate, region.name],
  );

  useEffect(() => {
    fetch(metricSelection.url)
      .then((d) => d.json())
      .then((d) => setChartData(d));
  }, [metricSelection.url]);

  const boundarySummary = regions.find(
    (regionBoundarySummary) => regionBoundarySummary.name === region.name,
  );

  return (
    <>
      <Stack direction="column" gap={6} alignItems={'center'} paddingBottom={100}>
        <RegionMetricsHeader />

        <Stack direction="column" gap={5} alignItems={'center'} mt={10} pt={5} pb={20}>
          <Stack direction="row" alignItems={'center'} gap={5}>
            <Stack direction="column" alignItems={'center'}>
              <RegionSearchNavigation
                regions={regions}
                title="Select a country"
                selectedRegionSummary={boundarySummary}
                metricId={selectedMetricId}
              />
              <Typography textAlign="center">
                Or <AppLink to="/metrics/regions">browse all countries</AppLink>
              </Typography>
            </Stack>

            <Stack direction="column" alignItems={'center'} width={'300px'}>
              <ParamDropdown
                title={'Metric'}
                onChange={(selection) => handleMetricSelection(selection)}
                value={selectedMetricId}
                options={metricOptions}
              />
            </Stack>
          </Stack>

          <Stack direction="row" gap={5}>
            <Stack>
              <FormControlLabel
                label="Fix scale across years"
                control={
                  <Checkbox
                    checked={scaleAcrossYears}
                    onChange={(e, checked) => setScaleAcrossYears(checked)}
                  />
                }
              />

              <FormControlLabel
                label="Fix scale across countries"
                control={
                  <Checkbox
                    checked={scaleAcrossCountries}
                    onChange={(e, checked) => setScaleAcrossCountries(checked)}
                  />
                }
              />
            </Stack>
          </Stack>

          <Box padding={10}>
            {chartData ? (
              <Dashboard
                region={region}
                chartData={chartData}
                metricId={metricId}
                scaleAcrossCountries={scaleAcrossCountries}
                scaleAcrossYears={scaleAcrossYears}
              />
            ) : (
              <div>Loading data...</div>
            )}
          </Box>
        </Stack>
      </Stack>

      <Footer />
    </>
  );
};

Component.displayName = 'SingleRegionPage';
