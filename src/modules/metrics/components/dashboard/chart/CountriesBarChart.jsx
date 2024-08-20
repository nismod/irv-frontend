import { Box } from '@mui/material';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

import Axis from '@/modules/metrics/components/lib/chart/Axis';
import Chart from '@/modules/metrics/components/lib/chart/Chart';
import {
  accessorPropsType,
  useChartDimensions,
} from '@/modules/metrics/components/lib/chart/utils';

const Timeline = ({
  label,
  highlightRegion,
  setHighlightRegion,
  selectedYear,
  allData,
  countryId,
  domainY,
  colorScale,
}) => {
  const [ref, dimensions] = useChartDimensions();

  // const nationalDataOnly = allData
  //   .filter((d) => d.Level === 'National')
  //   .filter((d) => d[selectedYear])
  //   .sort((a, b) => b[selectedYear] - a[selectedYear]);

  const regionalDataOnly = allData
    .filter((d) => d.ISO_Code === countryId.toUpperCase())
    .filter((d) => d[selectedYear])
    .sort((a, b) => a[selectedYear] - b[selectedYear]);

  const chartData = regionalDataOnly;

  const xScale = d3
    .scaleBand()
    .domain(chartData.map((d) => d.GDLCODE))
    .range([0, dimensions.boundedWidth])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([domainY[0] - 0.01, domainY[1]])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const allShapes = chartData.map((d, i) => {
    const x = xScale(d.GDLCODE);

    if (x === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <rect
          x={x}
          y={dimensions.boundedHeight - (dimensions.boundedHeight - yScale(d[selectedYear]))}
          width={xScale.bandwidth()}
          height={dimensions.boundedHeight - yScale(d[selectedYear])}
          stroke={'black'}
          fill={colorScale(d[selectedYear])}
          fillOpacity={0.8}
          strokeWidth={2}
          strokeOpacity={d.GDLCODE === highlightRegion ? 1 : 0}
          onMouseEnter={() => setHighlightRegion(d.GDLCODE)}
          onMouseLeave={() => setHighlightRegion(null)}
          rx={1}
        />
        <text
          className={d.GDLCODE === highlightRegion ? 'highlight' : null}
          textAnchor="end"
          alignmentBaseline="central"
          transform={`translate(${x + xScale.bandwidth() / 2}, ${
            dimensions.boundedHeight + 10
          }), rotate(-70)`}
          fontSize={12}
          fill={'red'}
          opacity={
            d.ISO_Code === countryId.toUpperCase() ||
            ('CHE' === d.ISO_Code) === countryId.toUpperCase()
              ? 1
              : 0
          }
        >
          {d.Region}
        </text>
      </g>
    );
  });

  return (
    <Box
      className="RegionsLineChart"
      ref={ref}
      sx={{ height: '330px', width: '100%', maxWidth: '750px' }}
    >
      <>
        <Chart dimensions={dimensions}>
          <line
            className="Axis__line"
            x2={dimensions.boundedWidth}
            transform={`translate(0, ${dimensions.boundedHeight})`}
          />
          <Axis dimension="y" scale={yScale} label={label} />
          {allShapes}
        </Chart>
      </>
    </Box>
  );
};

Timeline.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  label: PropTypes.string,
};

Timeline.defaultProps = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};
export default Timeline;
