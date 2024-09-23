import { Box } from '@mui/material';
import * as d3 from 'd3';

import Axis from '@/modules/metrics/components/lib/chart/axis/Axis';
import Chart from '@/modules/metrics/components/lib/chart/Chart';
import Line from '@/modules/metrics/components/lib/chart/Line';
import { useChartDimensions } from '@/modules/metrics/components/lib/chart/utils';

import Dimension from '../../lib/chart/types/Dimension';

const formatYear = d3.format('.0f');

const findHighlightPoint = (dataByYearGroupedList, regionKey, selectedYear, xScale, yScale) => {
  const dataRecord = dataByYearGroupedList.find((d) => d.regionKey === regionKey);
  if (!dataRecord || !dataRecord.indexData) return null;

  const dataForYear = dataRecord.indexData.find((d) => d.year === selectedYear);
  if (!dataForYear) return null;

  return {
    x: xScale(selectedYear),
    y: yScale(dataForYear.value),
  };
};

const RegionsLineChart = ({
  xAccessor,
  yAccessor,
  label,
  dataFiltered,
  dataByYearGroupedList,
  highlightRegion,
  setHighlightRegion,
  selectedYear,
  updateSelectedYear,
  domainY,
}) => {
  const [ref, dimensions] = useChartDimensions(null);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataFiltered, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3.scaleLinear().domain(domainY).range([dimensions.boundedHeight, 0]).nice();

  const xAccessorScaled = (d) => xScale(xAccessor(d));
  const yAccessorScaled = (d) => yScale(yAccessor(d));

  const highlightPoint = findHighlightPoint(
    dataByYearGroupedList,
    highlightRegion,
    selectedYear,
    xScale,
    yScale,
  );

  const resetHighlight = () => {
    setHighlightRegion(null);
  };

  const xExtent = d3.extent(dataFiltered, xAccessor);

  const yearList = [];
  for (var i = xExtent[0]; i <= xExtent[1]; i++) {
    yearList.push(i);
  }

  const points = dataFiltered.map((d) => [xAccessorScaled(d), yAccessorScaled(d), d.gdlCode]);
  const yearPoints = yearList.map((d) => [xScale(d), d]);

  const onPointerMove = (event) => {
    // Find nearest data point based on coordinates of click event
    const [pointerX, pointerY] = d3.pointer(event);
    const nearestIndex = d3.leastIndex(points, ([x, y]) => Math.hypot(x - pointerX, y - pointerY));
    const regionKey = points[nearestIndex][2];

    setHighlightRegion(regionKey);
  };

  const onPointerLeave = () => {
    resetHighlight();
  };

  const onPointerClick = (event) => {
    // Find nearest year based on x value of click event
    const [pointerX] = d3.pointer(event);
    const nearestIndex = d3.leastIndex(yearPoints, ([x, year]) => Math.abs(pointerX - x));
    const year = yearPoints[nearestIndex][1];

    updateSelectedYear(year);
  };

  return (
    <Box
      className="RegionsLineChart"
      ref={ref}
      sx={{ height: '330px', width: '100%', backgroundColor: 'white' }}
    >
      <Chart dimensions={dimensions}>
        <rect
          width={dimensions.boundedWidth}
          height={dimensions.boundedHeight}
          fill="white"
          opacity={1}
        />

        <Axis dimension={Dimension.X} scale={xScale} formatTick={formatYear} />
        <Axis dimension={Dimension.Y} scale={yScale} label={label} />

        {dataByYearGroupedList.map((d) => (
          <Line
            key={d.regionKey}
            data={d.indexData}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            isHighlighted={highlightRegion && d.regionKey === highlightRegion}
          />
        ))}

        {highlightPoint && highlightPoint.x && (
          <circle className="Circles__circle" cx={highlightPoint.x} cy={highlightPoint.y} r={2} />
        )}

        <text x={xScale(selectedYear)} y={-4} textAnchor="middle">
          {selectedYear}
        </text>
        <rect
          width={5}
          height={dimensions.boundedHeight}
          fill="rgba(0, 0, 0)"
          opacity={0.1}
          x={xScale(selectedYear) - 2.5}
        />

        <rect
          width={dimensions.boundedWidth}
          height={dimensions.boundedHeight}
          fill="rgba(0, 0, 0)"
          opacity={0.0}
          onPointerMove={onPointerMove}
          onPointerOut={onPointerLeave}
          onClick={onPointerClick}
          cursor={'pointer'}
        />
      </Chart>
    </Box>
  );
};

export default RegionsLineChart;
