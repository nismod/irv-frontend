import { createContext, FC, ReactNode, useContext } from 'react';

import './Chart.css';

import ChartLayout from './types/ChartLayout';

const defaultChartContext = {
  height: 0,
  width: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  boundedWidth: 0,
  boundedHeight: 0,
};
const ChartContext = createContext(defaultChartContext);
export const useDimensionsContext = () => useContext(ChartContext);

type ChartProps = {
  dimensions: ChartLayout;
  children?: ReactNode;
};

const Chart: FC<ChartProps> = ({ dimensions, children }) => (
  <ChartContext.Provider value={dimensions}>
    <svg className="Chart" width={dimensions.width} height={dimensions.height}>
      <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>{children}</g>
    </svg>
  </ChartContext.Provider>
);

export default Chart;
