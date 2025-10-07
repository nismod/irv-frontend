import Box from '@mui/material/Box';
import { extent as d3extent, leastIndex as d3leastIndex } from 'd3-array';
import { format as d3format } from 'd3-format';
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { pointer as d3pointer } from 'd3-selection';

import Axis from '@/modules/metrics/components/lib/chart/axis/Axis';
import Chart from '@/modules/metrics/components/lib/chart/Chart';
import Line from '@/modules/metrics/components/lib/chart/Line';
import Dimension from '@/modules/metrics/components/lib/chart/types/Dimension';
import { numericDomain, useChartDimensions } from '@/modules/metrics/components/lib/chart/utils';

const formatYear = d3format('.0f');

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

  const xScale = d3scaleLinear()
    .domain(numericDomain(d3extent(dataFiltered, xAccessor)))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3scaleLinear().domain(domainY).range([dimensions.boundedHeight, 0]).nice();

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

  const xExtent = numericDomain(d3extent(dataFiltered, xAccessor));

  const yearList = [];
  for (let i = xExtent[0]; i <= xExtent[1]; i++) {
    yearList.push(i);
  }

  const points = dataFiltered.map((d) => [xAccessorScaled(d), yAccessorScaled(d), d.gdlCode]);
  const yearPoints = yearList.map((d) => [xScale(d), d]);

  const onPointerMove = (event) => {
    // Find nearest data point based on coordinates of click event
    const [pointerX, pointerY] = d3pointer(event);
    const nearestIndex = d3leastIndex(points, ([x, y]) => Math.hypot(x - pointerX, y - pointerY));
    const regionKey = points[nearestIndex][2];

    setHighlightRegion(regionKey);
  };

  const onPointerLeave = () => {
    resetHighlight();
  };

  const onPointerClick = (event) => {
    // Find nearest year based on x value of click event
    const [pointerX] = d3pointer(event);
    const nearestIndex = d3leastIndex(yearPoints, ([x, year]) => Math.abs(pointerX - x));
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
