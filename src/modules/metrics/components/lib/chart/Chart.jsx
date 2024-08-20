import { createContext, useContext } from 'react';

import './Chart.css';

const ChartContext = createContext();
export const useDimensionsContext = () => useContext(ChartContext);

const Chart = ({ dimensions, children, ...interactionProps }) => (
  <ChartContext.Provider value={dimensions}>
    <svg className="Chart" width={dimensions.width} height={dimensions.height}>
      <g
        {...interactionProps}
        transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
      >
        {children}
      </g>
    </svg>
  </ChartContext.Provider>
);

export default Chart;
