import MapIcon from '@mui/icons-material/Map';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { Boundary } from '@nismod/irv-autopkg-client';
import * as d3 from 'd3';
import { FC, useEffect, useState } from 'react';

import { useIsMobile } from '@/use-is-mobile';

import CountriesBarChart from './chart/CountriesBarChart';
import RegionsLineChart from './chart/RegionsLineChart';
import RegionMap from './map/RegionMap';

const getDefaultRegionKey = (dataByYearGroupedList) => {
  const dataLength = dataByYearGroupedList.length;
  if (dataLength < 1) {
    return null;
  }

  if (dataLength === 1) {
    return dataByYearGroupedList[0].regionKey;
  }

  const maybeTotal = dataByYearGroupedList.find((d) => d.regionKey.endsWith('t'));

  if (maybeTotal) {
    return maybeTotal.regionKey;
  }

  return null;
};

const compileTimelineDomainY = (scaleAcrossCountries, allDataPerYear, dataFiltered, yAccessor) => {
  if (scaleAcrossCountries) {
    return d3.extent(allDataPerYear, yAccessor);
  }
  return d3.extent(dataFiltered, yAccessor);
};

const compileDomainY = (
  scaleAcrossCountries,
  scaleAcrossYears,
  allDataPerYear,
  dataFiltered,
  yAccessor,
  selectedYear,
) => {
  if (scaleAcrossYears) {
    return compileTimelineDomainY(scaleAcrossCountries, allDataPerYear, dataFiltered, yAccessor);
  }

  if (scaleAcrossCountries) {
    return d3.extent(
      allDataPerYear.filter((d) => d.year === selectedYear && d.value !== null),
      yAccessor,
    );
  }

  return d3.extent(
    dataFiltered.filter((d) => d.year === selectedYear),
    yAccessor,
  );
};

type DashboardChartsProps = {
  country: Boundary;
  geojson: any;
  selectedCountryData: any;
  dataFiltered: any[];
  dataByYearGroupedList: any[];
  allData: any;
  allDataPerYear: any[];
  scaleAcrossYears: boolean;
  scaleAcrossCountries: boolean;
  metricLabel: string;
  selectedYear: number;
  updateSelectedYear: (year: any) => void;
};

const DashboardCharts: FC<DashboardChartsProps> = ({
  country,
  geojson,
  selectedCountryData,
  dataFiltered,
  dataByYearGroupedList,
  allData,
  allDataPerYear,
  scaleAcrossYears,
  scaleAcrossCountries,
  metricLabel,
  selectedYear,
  updateSelectedYear,
}) => {
  const [highlightRegion, setHighlightRegion] = useState(null);

  const isMobile = useIsMobile();

  const yAccessor = (d) => d.value;
  const timelineDomainY = compileDomainY(
    scaleAcrossCountries,
    true,
    allDataPerYear,
    dataFiltered,
    yAccessor,
    selectedYear,
  );
  const domainY = compileDomainY(
    scaleAcrossCountries,
    scaleAcrossYears,
    allDataPerYear,
    dataFiltered,
    yAccessor,
    selectedYear,
  );

  const resetHighlightRegion = (dataByYearGroupedList) => {
    setHighlightRegion(getDefaultRegionKey(dataByYearGroupedList));
  };

  useEffect(() => {
    resetHighlightRegion(dataByYearGroupedList);
  }, [dataByYearGroupedList]);

  const updateHighlightRegion = (regionId) => {
    if (!regionId) {
      resetHighlightRegion(dataByYearGroupedList);
    } else {
      setHighlightRegion(regionId);
    }
  };

  const colorInterpolator = d3.interpolateRdYlGn;
  const colorScale = d3.scaleSequential().domain(domainY).interpolator(colorInterpolator);

  const xBoundsOnly = country.envelope.coordinates[0].map((d) => d[0]);
  const averageXBounds = xBoundsOnly.reduce((a, b) => a + b) / xBoundsOnly.length;

  const yBoundsOnly = country.envelope.coordinates[0].map((d) => d[1]);
  const averageYBounds = yBoundsOnly.reduce((a, b) => a + b) / yBoundsOnly.length;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: 'white',
        width: '100%',
        padding: '25px',
        pb: '100px',
      })}
    >
      <Stack
        sx={{ alignItems: 'center', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}
        gap={2}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent={'center'}
          width="100%"
          padding="0px"
          alignItems={isMobile ? 'center' : 'end'}
          gap={5}
        >
          <Stack sx={{ maxHeight: '500px', width: isMobile ? '100%' : '50%' }}>
            {!selectedCountryData.length ? (
              <Stack direction={'column'} alignItems={'center'}>
                <Typography>No data available.</Typography>
              </Stack>
            ) : (
              <></>
            )}
            <Stack direction="row" justifyContent={'space-between'}>
              <Typography variant="h2">{country.name_long}</Typography>

              <IconButton
                onClick={() =>
                  window.open(
                    `https://global.infrastructureresilience.org/view/vulnerability?y=${averageYBounds}&x=${averageXBounds}&z=3&sections=%7B%22hazards%22%3A%7B%7D%2C%22vulnerability%22%3A%7B%22human%22%3A%7B%22human-development%22%3Atrue%7D%7D%7D`,
                    '_blank',
                  )
                }
              >
                <MapIcon color="action" />
              </IconButton>
            </Stack>
            <RegionMap
              countryEnvelope={country.envelope}
              countryId={country.name}
              width="100%"
              height="300px"
              selectedCountryData={selectedCountryData}
              highlightRegion={highlightRegion}
              setHighlightRegion={updateHighlightRegion}
              selectedYear={selectedYear}
              domainY={domainY}
              geojson={geojson}
              label={`${metricLabel} (${selectedYear})`}
            />
          </Stack>

          {selectedCountryData.length ? (
            <Stack
              direction="row"
              justifyContent={'end'}
              alignItems={'start'}
              width={isMobile ? '100%' : '50%'}
            >
              <RegionsLineChart
                xAccessor={(d) => d.year}
                yAccessor={(d) => d.value}
                label={metricLabel}
                dataFiltered={dataFiltered}
                dataByYearGroupedList={dataByYearGroupedList}
                highlightRegion={highlightRegion}
                setHighlightRegion={updateHighlightRegion}
                selectedYear={selectedYear}
                updateSelectedYear={updateSelectedYear}
                domainY={timelineDomainY}
              />
            </Stack>
          ) : (
            // Needed for MUI otherwise "0"
            <></>
          )}
        </Stack>

        {selectedCountryData.length ? (
          <CountriesBarChart
            label={`${metricLabel} (${selectedYear})`}
            highlightRegion={highlightRegion}
            setHighlightRegion={updateHighlightRegion}
            selectedYear={selectedYear}
            allData={allData}
            countryId={country.name}
            domainY={domainY}
            colorScale={colorScale}
          />
        ) : (
          // Needed for MUI otherwise "0"
          <></>
        )}
      </Stack>
    </Box>
  );
};

export default DashboardCharts;
