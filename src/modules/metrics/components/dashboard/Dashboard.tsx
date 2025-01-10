import { group as d3group } from 'd3-array';
import { FC } from 'react';

import type { AnnualGdlRecord } from '../../types/AnnualGdlData';
import type { NationalGeo } from '../../types/NationalGeo';
import DashboardCharts from './DashboardCharts';

const compileDataPerYear = (data): AnnualGdlRecord[] => {
  return data.map((d) => ({
    year: d.year,
    iso: d.iso_code,
    gdlCode: d.gdl_code,
    regionName: d.region_name,
    value: d.value,
  }));
};

type DashboardProps = {
  chartData: any;
  geojson: any;
  nationalGeo: NationalGeo;
  metricLabel: string;
  scaleAcrossCountries: boolean;
  scaleAcrossYears: boolean;
  selectedYear: number;
  updateSelectedYear: (year: any) => void;
};

const Dashboard: FC<DashboardProps> = ({
  chartData,
  geojson,
  nationalGeo,
  metricLabel,
  scaleAcrossCountries,
  scaleAcrossYears,
  selectedYear,
  updateSelectedYear,
}) => {
  const regionId = nationalGeo.isoCode;
  const selectedCountryData = chartData.filter((d) => d.iso_code === regionId);
  const countryDataPerYear = compileDataPerYear(selectedCountryData);
  const allDataPerYear = compileDataPerYear(chartData);

  // Assumes data is already filtered by country
  const dataFiltered = countryDataPerYear.filter((d) => d.value !== null);

  // group the data - one line per group
  const dataByYearGrouped = d3group(dataFiltered, (d) => d.gdlCode);
  const dataByYearGroupedList = [];

  dataByYearGrouped.forEach((value, key) => {
    dataByYearGroupedList.push({ regionKey: key, indexData: value });
  });

  return (
    <DashboardCharts
      geojson={geojson}
      nationalGeo={nationalGeo}
      selectedCountryData={countryDataPerYear}
      dataFiltered={dataFiltered}
      dataByYearGroupedList={dataByYearGroupedList}
      allDataPerYear={allDataPerYear}
      scaleAcrossYears={scaleAcrossYears}
      scaleAcrossCountries={scaleAcrossCountries}
      metricLabel={metricLabel}
      selectedYear={selectedYear}
      updateSelectedYear={updateSelectedYear}
    />
  );
};

export default Dashboard;
