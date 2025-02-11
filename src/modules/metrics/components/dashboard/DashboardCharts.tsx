import MapIcon from '@mui/icons-material/Map';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { scaleSequential as d3scaleSequential } from 'd3-scale';
import { interpolateRdYlGn as d3interpolateRdYlGn } from 'd3-scale-chromatic';
import { FC, useEffect, useState } from 'react';

import CountriesBarChart from '@/modules/metrics/components/dashboard/chart/CountriesBarChart';
import RegionsLineChart from '@/modules/metrics/components/dashboard/chart/RegionsLineChart';
import RegionMap from '@/modules/metrics/components/dashboard/map/RegionMap';
import { useIsMobile } from '@/use-is-mobile';

import { AnnualGdlGrouped, AnnualGdlRecord } from '../../types/AnnualGdlData';
import { DatasetExtent, DatasetExtentList } from '../../types/DatasetExtent';
import { NationalGeo } from '../../types/NationalGeo';
import { RegionGeo } from '../../types/RegionGeo';

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

type DashboardChartsProps = {
  annualData: AnnualGdlRecord[];
  annualDataGrouped: AnnualGdlGrouped[];
  datasetExtent: DatasetExtent;
  regionsGeo: RegionGeo[];
  nationalGeo: NationalGeo;
  selectedYear: number;
  metricLabel: string;
  updateSelectedYear: (year: any) => void;
};

const DashboardCharts: FC<DashboardChartsProps> = ({
  annualData,
  annualDataGrouped,
  datasetExtent,
  regionsGeo,
  nationalGeo,
  selectedYear,
  metricLabel,
  updateSelectedYear,
}) => {
  const [highlightRegion, setHighlightRegion] = useState(null);

  const isMobile = useIsMobile();

  const timelineDomainY: DatasetExtentList = [datasetExtent.min, datasetExtent.max];
  const domainY: DatasetExtentList = [datasetExtent.min, datasetExtent.max];

  const resetHighlightRegion = (annualDataGrouped) => {
    setHighlightRegion(getDefaultRegionKey(annualDataGrouped));
  };

  useEffect(() => {
    resetHighlightRegion(annualDataGrouped);
  }, [annualDataGrouped]);

  const updateHighlightRegion = (regionId) => {
    if (!regionId) {
      resetHighlightRegion(annualDataGrouped);
    } else {
      setHighlightRegion(regionId);
    }
  };

  const colorInterpolator = d3interpolateRdYlGn;
  const colorScale = d3scaleSequential().domain(domainY).interpolator(colorInterpolator);

  const xBoundsOnly = nationalGeo.envelope.coordinates[0].map((d) => d[0]);
  const averageXBounds = xBoundsOnly.reduce((a, b) => a + b) / xBoundsOnly.length;

  const yBoundsOnly = nationalGeo.envelope.coordinates[0].map((d) => d[1]);
  const averageYBounds = yBoundsOnly.reduce((a, b) => a + b) / yBoundsOnly.length;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: 'white',
        width: '100%',
        padding: '25px',
        pb: '100px',
        minWidth: '250px',
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
            {!annualData.length ? (
              <Stack direction={'column'} alignItems={'center'}>
                <Typography>No data available.</Typography>
              </Stack>
            ) : (
              <></>
            )}
            <Stack direction="row" justifyContent={'space-between'}>
              <Typography variant="h2">{nationalGeo.countryName}</Typography>

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
              width="100%"
              height="300px"
              selectedCountryData={annualData}
              highlightRegion={highlightRegion}
              setHighlightRegion={updateHighlightRegion}
              selectedYear={selectedYear}
              domainY={domainY}
              geojson={regionsGeo}
              nationalGeo={nationalGeo}
              label={`${metricLabel} (${selectedYear})`}
            />
          </Stack>

          {annualData.length ? (
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
                dataFiltered={annualData}
                dataByYearGroupedList={annualDataGrouped}
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

        {annualData.length ? (
          <CountriesBarChart
            label={`${metricLabel} (${selectedYear})`}
            highlightRegion={highlightRegion}
            setHighlightRegion={updateHighlightRegion}
            selectedYear={selectedYear}
            selectedCountryData={annualData}
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
