import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useState } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

import { ParamDropdown } from '@/lib/controls/ParamDropdown';

import Dashboard from '@/modules/metrics/components/dashboard/Dashboard';
import { RegionSearchNavigation } from '@/modules/metrics/components/region-search/RegionSearchNavigation';
import { gdlDatasets } from '@/modules/metrics/data/gdl-datasets';
import { useIsMobile } from '@/use-is-mobile';

import { AnnualGdlRecord } from '../types/AnnualGdlData';
import type { CountryOption } from '../types/CountryOption';
import { DatasetExtent } from '../types/DatasetExtent';
import type { NationalGeo } from '../types/NationalGeo';
import { RegionGeo } from '../types/RegionGeo';

export const loader = async ({ params: { regionId, metricId } }: LoaderFunctionArgs) => {
  return {
    regionId: regionId,
    metricId: metricId,
  };
};
type RegionMetricsLoaderData = {
  regionId: string;
  metricId: string;
};

export const Component = () => {
  const { regionId, metricId } = useLoaderData() as RegionMetricsLoaderData;

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // country list
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>();

  // boundaries
  const [regionsGeo, setRegionsGeo] = useState<RegionGeo[]>();
  const [nationalGeo, setNationalGeo] = useState<NationalGeo>();

  // annual data
  const [annualData, setAnnualData] = useState<AnnualGdlRecord[]>(null);

  // data extents across all countries and years (to calculate color and axis scales)
  const [datasetExtent, setDatasetExtent] = useState<DatasetExtent>(null);

  const [selectedYear, setSelectedYear] = useState<number>(2010);

  const [countryFetchError, setCountryFetchError] = useState(null);

  // fetch list of countries
  const countryMetaUrl = '/api/metrics/gdl/meta/countries';
  useEffect(() => {
    fetch(countryMetaUrl)
      .then((response) => response.json())
      .then((json) =>
        json.map((country) => ({
          label: country.country_name,
          code: country.iso_code,
        })),
      )
      .then((dataList) => {
        setCountryOptions(dataList);
      })
      .catch((error) => {
        setCountryFetchError(error);
      });
  }, [countryMetaUrl]);

  // fetch national boundaries
  const nationalGeoUrl = `/api/metrics/gdl/geojson/national/iso/${regionId}`;
  useEffect(() => {
    fetch(nationalGeoUrl)
      .then((d) => d.json())
      .then((d) => {
        setNationalGeo({
          boundary: d.boundary,
          envelope: d.envelope,
          countryName: d.properties.country_name,
          isoCode: d.properties.iso_code,
        });

        setCountryFetchError(false);
      })
      .catch((error) => {
        setNationalGeo(null);
      });
  }, [nationalGeoUrl]);

  // fetch subnational boundaries
  const geojsonUrl = `/api/metrics/gdl/geojson/subnational/iso/${regionId}`;
  useEffect(() => {
    fetch(geojsonUrl)
      .then((response) => response.json())
      .then((json) =>
        json.map((record) => ({
          geometry: record.geometry,
          type: record.type,
          properties: {
            gdlCode: record.properties.gdl_code,
            isoCode: record.properties.iso_code,
            level: record.properties.level,
            regionName: record.properties.region_name,
          },
        })),
      )
      .then((d) => setRegionsGeo(d))
      .catch((error) => {
        setRegionsGeo(null);
      });
  }, [geojsonUrl]);

  // fetch annual data for country and dataset
  const annualDataUrl = `/api/metrics/gdl/data/${metricId}/${regionId}`;
  useEffect(() => {
    fetch(annualDataUrl)
      .then((response) => response.json())
      .then((json) =>
        json.map((record) => ({
          year: record.year,
          gdlCode: record.gdl_code,
          regionName: record.region_name,
          value: record.value,
        })),
      )
      .then((dataList) => setAnnualData(dataList))
      .catch((error) => {
        setAnnualData(null);
      });
  }, [annualDataUrl]);

  // fetch extents of full dataset for color/axis scaling
  const extentUrl = `/api/metrics/gdl/data/${metricId}/extent`;
  useEffect(() => {
    fetch(extentUrl)
      .then((d) => d.json())
      .then((d) => setDatasetExtent(d))
      .catch((error) => {
        setDatasetExtent(null);
      });
  }, [extentUrl]);

  const updateSelectedYear = (year) => {
    setSelectedYear(year);
  };

  const selectedMetricOrDefault = (selection) => {
    const maybeMetricMatch = gdlDatasets.find((option) => option.value === selection);
    return maybeMetricMatch ? maybeMetricMatch : gdlDatasets[0];
  };

  const handleMetricSelection = useCallback(
    (selection: string) => {
      const selectedMetric = selectedMetricOrDefault(selection);
      setTimeout(() => {
        navigate(
          `/metrics/regions/${regionId}/${selectedMetric.value}`,
          { preventScrollReset: true }, // don't scroll to top on navigate
        );
      }, 100);
    },
    [navigate, regionId],
  );

  if (!countryOptions) {
    if (countryFetchError) {
      return <>There was an error loading the data</>;
    }
    return <>Loading country options...</>;
  }

  const selectedMetric = selectedMetricOrDefault(metricId);
  const selectedMetricId = selectedMetric.value;
  const selectedMetricLabel = selectedMetric.label;

  // only show available years as selectable
  const yearOptions = new Set<number>();
  annualData?.forEach((record) => yearOptions.add(record.year));
  if (yearOptions.size > 0 && !yearOptions.has(selectedYear)) {
    updateSelectedYear([...yearOptions].sort((a, b) => a - b)[0]);
  }

  return (
    <Stack direction="column" gap={6} alignItems={'center'} paddingBottom={20} width={'100%'}>
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
              width={isMobile ? '350px' : '450px'}
            >
              <RegionSearchNavigation
                regions={countryOptions}
                title="Select a country"
                selectedRegionSummary={{
                  code: nationalGeo?.isoCode,
                  label: nationalGeo?.countryName,
                }}
                metricId={selectedMetricId}
              />
            </Stack>
          </Stack>

          <Stack
            direction={isMobile ? 'column' : 'row'}
            gap={isMobile ? 3 : 7}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Stack direction="column" alignItems={'center'} width={isMobile ? '350px' : '450px'}>
              <ParamDropdown
                title={'Metric'}
                onChange={(selection) => handleMetricSelection(selection)}
                value={selectedMetricId}
                options={gdlDatasets}
              />
            </Stack>

            <Stack direction="column" alignItems={'center'} width={isMobile ? '350px' : '450px'}>
              <ParamDropdown
                title={'Year'}
                onChange={(selection) => updateSelectedYear(selection)}
                value={selectedYear}
                options={[...yearOptions]}
              />
            </Stack>
          </Stack>
        </Stack>

        <Box paddingX={isMobile ? 2 : 5} width={'100%'}>
          {annualData && nationalGeo && regionsGeo && datasetExtent ? (
            <Dashboard
              annualData={annualData}
              datasetExtent={datasetExtent}
              regionsGeo={regionsGeo}
              nationalGeo={nationalGeo}
              selectedYear={selectedYear}
              updateSelectedYear={updateSelectedYear}
              metricLabel={selectedMetricLabel}
            />
          ) : (
            <div>No data available</div>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

Component.displayName = 'SingleRegionMetricsPage';
