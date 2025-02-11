import { group as d3group } from 'd3-array';
import { FC } from 'react';

import type { AnnualGdlRecord } from '../../types/AnnualGdlData';
import { DatasetExtent } from '../../types/DatasetExtent';
import type { NationalGeo } from '../../types/NationalGeo';
import { RegionGeo } from '../../types/RegionGeo';
import DashboardCharts from './DashboardCharts';

type DashboardProps = {
  annualData: AnnualGdlRecord[];
  datasetExtent: DatasetExtent;
  regionsGeo: RegionGeo[];
  nationalGeo: NationalGeo;
  selectedYear: number;
  metricLabel: string;
  updateSelectedYear: (year: any) => void;
};
const Dashboard: FC<DashboardProps> = ({
  annualData,
  datasetExtent,
  regionsGeo,
  nationalGeo,
  selectedYear,
  metricLabel,
  updateSelectedYear,
}) => {
  const annualDataFiltered = annualData.filter((d) => d.value !== null);

  // group the data - one line per group
  const dataByYearGrouped = d3group(annualDataFiltered, (d) => d.gdlCode);
  const dataByYearGroupedList = [];
  dataByYearGrouped.forEach((value, key) => {
    dataByYearGroupedList.push({ regionKey: key, indexData: value });
  });

  return (
    <DashboardCharts
      annualData={annualDataFiltered}
      annualDataGrouped={dataByYearGroupedList}
      datasetExtent={datasetExtent}
      regionsGeo={regionsGeo}
      nationalGeo={nationalGeo}
      selectedYear={selectedYear}
      updateSelectedYear={updateSelectedYear}
      metricLabel={metricLabel}
    />
  );
};

export default Dashboard;
