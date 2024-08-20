import * as d3 from 'd3';

import { DashboardCharts } from './DashboardCharts';

const YEAR_RANGE = [1990, 2021];

const compileDataPerYear = (dataPerRegion) => {
  const dataByYear = [];

  for (var i = YEAR_RANGE[0]; i <= YEAR_RANGE[1]; i++) {
    const year = i;
    const index = dataByYear.push({ year: year });
    dataPerRegion.forEach((d) => {
      const gdlCode = d.GDLCODE;
      const yearRecord = dataByYear[index - 1];
      yearRecord[gdlCode] = d[year];
    });
  }

  const dataPerYearTidy = [];
  dataPerRegion.forEach((d) => {
    for (var i = YEAR_RANGE[0]; i <= YEAR_RANGE[1]; i++) {
      dataPerYearTidy.push({
        year: i,
        value: d[i],
        country: d.Country,
        continent: d.Continent,
        iso: d.ISO_Code,
        level: d.Level,
        gdlCode: d.GDLCODE,
        region: d.Region,
      });
    }
  });

  return dataPerYearTidy;
};

export const Dashboard = ({
  region,
  chartData,
  metricId,
  scaleAcrossCountries,
  scaleAcrossYears,
}) => {
  const regionId = region.name;
  const selectedIsoCode = regionId.toUpperCase();
  const selectedCountryData = chartData.filter((d) => d.ISO_Code === selectedIsoCode);

  // const countryTotalsData = chartData.filter((d) => d.Region === 'Total');
  const countryDataPerYear = compileDataPerYear(selectedCountryData);
  const allDataPerYear = compileDataPerYear(chartData);

  // Assumes data is already filtered by country
  const dataFiltered = countryDataPerYear.filter((d) => d.value !== null);

  // group the data - one line per group
  const dataByYearGrouped = d3.group(dataFiltered, (d) => d.gdlCode);
  const dataByYearGroupedList = [];

  dataByYearGrouped.forEach((value, key) => {
    dataByYearGroupedList.push({ regionKey: key, indexData: value });
  });

  return (
    <DashboardCharts
      country={region}
      selectedCountryData={selectedCountryData}
      dataFiltered={dataFiltered}
      dataByYearGroupedList={dataByYearGroupedList}
      allData={chartData}
      allDataPerYear={allDataPerYear}
      scaleAcrossYears={scaleAcrossYears}
      scaleAcrossCountries={scaleAcrossCountries}
    />
  );
};
