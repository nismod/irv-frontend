import { Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { defer, LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';
import { AppLink } from '@/lib/nav';

import Dashboard from '@/modules/metrics/components/dashboard/Dashboard';
import { RegionSearchNavigation } from '@/modules/metrics/components/region-search/RegionSearchNavigation';
import { gdlDatasets } from '@/modules/metrics/data/gdl-datasets';
import { useIsMobile } from '@/use-is-mobile';

import { RegionMetricsHeader } from '../components/header/RegionMetricsHeader';
import { countriesUrl } from '../data/gdl-urls';
import type { CountryOption } from '../types/CountryOption';
import type { NationalGeo } from '../types/NationalGeo';

export const loader = async ({ params: { regionId, metricId } }: LoaderFunctionArgs) => {
  return defer({
    regionId: regionId,
    metricId: metricId,
  });
};
loader.displayName = 'regionMetricsLoader';
type RegionMetricsLoaderData = {
  regionId: string;
  metricId: string;
};

export const Component = () => {
  const { regionId, metricId } = useLoaderData() as RegionMetricsLoaderData;

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [allCountriesMeta, setAllCountriesMeta] = useState<CountryOption[]>([
    { code: 'afg', label: 'Afghanistan' },
  ]);
  const [chartData, setChartData] = useState(null);
  const [geojson, setGeoJson] = useState();
  const [nationalGeo, setNationalGeo] = useState<NationalGeo>();
  const [scaleAcrossYears, setScaleAcrossYears] = useState(false);
  const [scaleAcrossCountries, setScaleAcrossCountries] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2010);

  const updateSelectedYear = (year) => {
    setSelectedYear(year);
  };

  const maybeMetricSelection = gdlDatasets.find((option) => option.value === metricId);
  const metricSelection = maybeMetricSelection ? maybeMetricSelection : gdlDatasets[0];
  const selectedMetricId = metricSelection.value;

  // const selectedIsoCode = regionId;
  // const selectedCountryData = chartData?.filter((d) => d.iso_code === selectedIsoCode);
  const yearOptions = new Set<number>();

  // if (chartData) {
  //   selectedCountryData.forEach((d) => yearOptions.add(d.year));
  // }

  if (yearOptions.size > 0 && !yearOptions.has(selectedYear)) {
    updateSelectedYear([...yearOptions].sort((a, b) => a - b)[0]);
  }

  const handleMetricSelection = useCallback(
    (selection: String) => {
      const maybeMetricMatch = gdlDatasets.find((option) => option.value === selection);
      const selectionId = maybeMetricMatch ? maybeMetricMatch.value : gdlDatasets[0].value;
      if (selection != null) {
        setTimeout(() => {
          navigate(
            `/metrics/regions/${regionId}/${selectionId}`,
            { preventScrollReset: true }, // don't scroll to top on navigate
          );
        }, 100);
      }
    },
    [navigate, regionId],
  );

  useEffect(() => {
    fetch(countriesUrl)
      .then((d) => d.json())
      .then((d) => d.map((row) => ({ code: row.iso_code, label: row.country_name })))
      .then((d) => setAllCountriesMeta(d));
  }, []);

  const metricsUrl = `http://0.0.0.0:8000/v1/gdl/data/${metricSelection.value.toLowerCase()}`;
  useEffect(() => {
    fetch(metricsUrl)
      .then((d) => d.json())
      .then((d) => setChartData(d));
  }, [metricsUrl]);

  const nationalGeoUrl = `http://0.0.0.0:8000/v1/gdl/geojson/national/iso/${regionId}`;
  useEffect(() => {
    fetch(nationalGeoUrl)
      .then((d) => d.json())
      .then((d) =>
        setNationalGeo({
          boundary: d.boundary,
          envelope: d.envelope,
          countryName: d.properties.country_name,
          isoCode: d.properties.iso_code,
        }),
      );
  }, [nationalGeoUrl]);

  const geojsonUrl = `http://0.0.0.0:8000/v1/gdl/geojson/subnational/iso/${regionId}`;
  useEffect(() => {
    fetch(geojsonUrl)
      .then((d) => d.json())
      .then((d) => setGeoJson(d));
  }, [geojsonUrl]);

  if (!allCountriesMeta || !nationalGeo) {
    return <>Loading...</>;
  }

  return (
    <Stack direction="column" gap={6} alignItems={'center'} paddingBottom={20} width={'100%'}>
      <RegionMetricsHeader />
      <Stack
        direction="column"
        gap={isMobile ? 1 : 1}
        alignItems={'center'}
        paddingTop={5}
        width={'100%'}
      >
        <Stack
          direction={'column'}
          gap={isMobile ? 2 : 3}
          paddingX={0}
          sx={{ backgroundColor: 'white' }}
        >
          <Stack
            direction={isMobile ? 'column' : 'row'}
            alignItems={'center'}
            gap={5}
            justifyContent={'center'}
          >
            <Stack
              direction="column"
              alignItems={'center'}
              justifyContent={'center'}
              paddingX={2}
              width={'100%'}
            >
              <RegionSearchNavigation
                regions={allCountriesMeta}
                title="Select a country"
                selectedRegionSummary={{
                  code: nationalGeo?.isoCode,
                  label: nationalGeo?.countryName,
                }}
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
            <Stack direction="column" alignItems={'center'} width={'275px'} paddingX={2}>
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
              paddingX={2}
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

        <Box paddingX={isMobile ? 2 : 5} width={'100%'}>
          {chartData && geojson ? (
            <Dashboard
              chartData={chartData}
              geojson={geojson}
              nationalGeo={nationalGeo}
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
