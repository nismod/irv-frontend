import MapIcon from '@mui/icons-material/Map';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';

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
    // return [0, 1];
  }

  return d3.extent(
    dataFiltered.filter((d) => d.year === selectedYear),
    yAccessor,
  );
};

export const DashboardCharts = ({
  country,
  selectedCountryData,
  dataFiltered,
  dataByYearGroupedList,
  allData,
  allDataPerYear,
  scaleAcrossYears,
  scaleAcrossCountries,
}) => {
  const [highlightRegion, setHighlightRegion] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2010);

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

  return (
    <Box width={'100%'}>
      <Stack
        sx={{ alignItems: 'center', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}
        gap={2}
      >
        <Stack
          direction="row"
          justifyContent={'center'}
          width="100%"
          padding="0px"
          alignItems={'end'}
          gap={5}
        >
          <Stack sx={{ maxHeight: '500px', minWidth: '500px', maxWidth: '700px' }}>
            {!selectedCountryData.length ? (
              <Stack direction={'column'} alignItems={'center'}>
                <Typography>No data available.</Typography>
              </Stack>
            ) : (
              <></>
            )}
            <Stack direction="row" justifyContent={'space-between'}>
              <Typography variant="h2">{country.name_long}</Typography>

              <IconButton>
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
            />
          </Stack>

          {selectedCountryData.length ? (
            <Stack direction="row" justifyContent={'end'} alignItems={'start'}>
              <RegionsLineChart
                xAccessor={(d) => d.year}
                yAccessor={(d) => d.value}
                label="HDI"
                dataFiltered={dataFiltered}
                dataByYearGroupedList={dataByYearGroupedList}
                highlightRegion={highlightRegion}
                setHighlightRegion={updateHighlightRegion}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
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
            label="HDI"
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
