import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Boundary, BoundarySummary } from '@nismod/irv-autopkg-client';
import { useCallback, useEffect, useState } from 'react';
import { defer, LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { AppLink } from '@/lib/nav';

import Dashboard from '@/modules/metrics/components/dashboard/Dashboard';
import { RegionSearchNavigation } from '@/modules/metrics/components/region-search/RegionSearchNavigation';
import { fetchAllRegions, fetchRegionById } from '@/modules/metrics/data/fetch-regions';
import { GDL_YEAR_RANGE, gdlDatasets } from '@/modules/metrics/data/gdl-datasets';
import { useIsMobile } from '@/use-is-mobile';

export const loader = async ({
  request: { signal },
  params: { regionId, metricId },
}: LoaderFunctionArgs) => {
  return defer({
    regionId: regionId,
    region: await fetchRegionById({ regionId }, signal),
    regions: await fetchAllRegions({}, signal),
    metricId: metricId,
  });
};
loader.displayName = 'regionMetricsLoader';
type RegionMetricsLoaderData = {
  regionId: string;
  region: Boundary;
  regions: BoundarySummary[];
  metricId: string;
};

type HasData = {
  data: any;
};

export const Component = () => {
  const { regionId, region, regions, metricId } = useLoaderData() as RegionMetricsLoaderData;

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [chartData, setChartData] = useState(null);
  const [geojson, setGeoJson] = useState<HasData>();
  const [scaleAcrossYears, setScaleAcrossYears] = useState(false);
  const [scaleAcrossCountries, setScaleAcrossCountries] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2010);

  const updateSelectedYear = (year) => {
    setSelectedYear(year);
  };

  const maybeMetricSelection = gdlDatasets.find((option) => option.value === metricId);
  const metricSelection = maybeMetricSelection ? maybeMetricSelection : gdlDatasets[0];
  const selectedMetricId = metricSelection.value;

  const selectedIsoCode = regionId.toUpperCase();
  const selectedCountryData = chartData?.filter((d) => d.ISO_Code === selectedIsoCode);
  const yearOptions = new Set<number>();

  if (chartData) {
    for (let i: number = GDL_YEAR_RANGE[0]; i <= GDL_YEAR_RANGE[1]; i++) {
      const index = i;
      selectedCountryData.forEach((d) => {
        const maybeYearData = d[index];
        // falsy ok if 0
        if (maybeYearData !== undefined && maybeYearData !== null) {
          yearOptions.add(index);
        }
      });
    }
  }

  if (yearOptions.size > 0 && !yearOptions.has(selectedYear)) {
    updateSelectedYear([...yearOptions].sort((a, b) => a - b)[0]);
  }

  const handleMetricSelection = useCallback(
    (selection: string) => {
      const maybeMetricMatch = gdlDatasets.find((option) => option.value === selection);
      const selectionId = maybeMetricMatch ? maybeMetricMatch.value : gdlDatasets[0].value;
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

  console.log('metricSelection.url', metricSelection.url);
  useEffect(() => {
    fetch(metricSelection.url)
      .then((d) => d.json())
      .then((d) => setChartData(d));
  }, [metricSelection.url]);

  const geojsonUrl = `https://gri-country-api.vercel.app/api/${regionId}/geojson/subnational`;
  useEffect(() => {
    fetch(geojsonUrl)
      .then((d) => d.json())
      .then((d) => setGeoJson(d));
  }, [geojsonUrl]);

  const boundarySummary = regions.find(
    (regionBoundarySummary) => regionBoundarySummary.name === region.name,
  );

  return (
    <Stack direction="column" gap={6} alignItems={'center'} paddingBottom={100} width={'100%'}>
      <Stack
        direction="column"
        gap={isMobile ? 1 : 1}
        alignItems={'center'}
        paddingTop={5}
        width={'100%'}
      >
        <Stack
          direction={'column'}
          gap={isMobile ? 1 : 3}
          paddingX={0}
          sx={{ backgroundColor: 'white' }}
        >
          <Stack
            direction={isMobile ? 'column' : 'row'}
            alignItems={'center'}
            gap={5}
            justifyContent={'center'}
          >
            <Stack direction="column" alignItems={'center'} paddingX={2}>
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
          </Stack>

          <Stack
            direction={isMobile ? 'column' : 'row'}
            gap={isMobile ? 3 : 7}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Stack direction="column" alignItems={'center'} width={'275px'}>
              <ParamDropdown
                title={'Metric'}
                onChange={(selection) => handleMetricSelection(selection)}
                value={selectedMetricId}
                options={gdlDatasets}
              />
            </Stack>

            <Stack
              direction={'row'}
              gap={isMobile ? 5 : 8}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Stack
                direction="column"
                alignItems={'center'}
                maxWidth={'150px'}
                minWidth={isMobile ? 'auto' : '150px'}
              >
                <ParamDropdown
                  title={'Year'}
                  onChange={(selection) => updateSelectedYear(selection)}
                  value={selectedYear}
                  options={[...yearOptions]}
                />
              </Stack>
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
          </Stack>
        </Stack>

        <Box paddingX={isMobile ? 2 : 5} width={'100%'} height={'100vh'}>
          {chartData && geojson && geojson.data ? (
            <Dashboard
              region={region}
              chartData={chartData}
              geojson={geojson.data}
              metricLabel={metricSelection.label}
              scaleAcrossCountries={scaleAcrossCountries}
              scaleAcrossYears={scaleAcrossYears}
              selectedYear={selectedYear}
              updateSelectedYear={updateSelectedYear}
            />
          ) : (
            <div>Loading data...</div>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

Component.displayName = 'SingleRegionMetricsPage';
