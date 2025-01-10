import { Box } from '@mui/material';
import * as d3 from 'd3-scale';
import { FC } from 'react';

import Axis from '@/modules/metrics/components/lib/chart/axis/Axis';
import Chart from '@/modules/metrics/components/lib/chart/Chart';
import Dimension from '@/modules/metrics/components/lib/chart/types/Dimension';
import { useChartDimensions } from '@/modules/metrics/components/lib/chart/utils';

type CountriesBarChartProps = {
  label: string;
  highlightRegion: any;
  setHighlightRegion: (regionId: any) => void;
  selectedYear: number;
  selectedCountryData: any;
  domainY: any;
  colorScale: any;
};

const CountriesBarChart: FC<CountriesBarChartProps> = ({
  label,
  highlightRegion,
  setHighlightRegion,
  selectedYear,
  selectedCountryData,
  domainY,
  colorScale,
}) => {
  const [ref, dimensions] = useChartDimensions(null);
  const regionalDataOnly = selectedCountryData.sort((a, b) => a.value - b.value);
  const chartData = regionalDataOnly.filter((d) => d.year === selectedYear);

  const xScale = d3
    .scaleBand()
    .domain(chartData.map((d) => d.gdlCode))
    .range([0, dimensions.boundedWidth])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([domainY[0] - 0.01, domainY[1]])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const allShapes = chartData.map((d, i) => {
    const x = xScale(d.gdlCode);

    if (x === undefined) {
      return null;
    }

    const maybeBarHeight = dimensions.boundedHeight - yScale(d.value) - 0.5; // don't overlap axis
    const barHeight = maybeBarHeight > 0 ? maybeBarHeight : 0; // ensure non-negative

    return (
      <g key={i}>
        <rect
          x={x}
          y={dimensions.boundedHeight - (dimensions.boundedHeight - yScale(d.value))}
          width={xScale.bandwidth()}
          height={barHeight}
          stroke={'black'}
          fill={colorScale(d.value)}
          fillOpacity={0.8}
          strokeWidth={2}
          strokeOpacity={d.gdlCode === highlightRegion ? 1 : 0}
          onMouseEnter={() => setHighlightRegion(d.gdlCode)}
          onMouseLeave={() => setHighlightRegion(null)}
          rx={1}
        />
        <text
          className={d.gdlCode === highlightRegion ? 'highlight' : null}
          textAnchor="end"
          alignmentBaseline="central"
          transform={`translate(${x + xScale.bandwidth() / 2}, ${
            dimensions.boundedHeight + 10
          }), rotate(-70)`}
          fontSize={12}
        >
          {d.regionName.split('(')[0].trim()}
        </text>
      </g>
    );
  });

  return (
    <Box
      className="RegionsLineChart"
      ref={ref}
      sx={{
        height: '330px',
        width: '100%',
        maxWidth: allShapes.length > 20 ? '900px' : '750px',
        backgroundColor: 'white',
      }}
    >
      <>
        <Chart dimensions={dimensions}>
          <rect
            width={dimensions.boundedWidth}
            height={dimensions.boundedHeight}
            fill="white"
            opacity={1}
          />

          <line
            className="Axis__line"
            x2={dimensions.boundedWidth}
            transform={`translate(0, ${dimensions.boundedHeight})`}
          />
          {allShapes}
          <Axis dimension={Dimension.Y} scale={yScale} label={label} />
        </Chart>
      </>
    </Box>
  );
};

export default CountriesBarChart;
