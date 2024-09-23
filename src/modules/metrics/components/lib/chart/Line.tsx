import * as d3 from 'd3';
import { FC } from 'react';

type LineProps = {
  data: any;
  xAccessor: any;
  yAccessor: any;
  isHighlighted: boolean;
  interpolation?: (value: number) => number; // D3 function
};

const Line: FC<LineProps> = ({
  data,
  xAccessor,
  yAccessor,
  isHighlighted,
  interpolation = d3.curveMonotoneX,
  ...props
}) => {
  const type = 'line';
  const lineGenerator = d3[type]().x(xAccessor).y(yAccessor).curve(interpolation);

  const className = isHighlighted ? `Line Line--type-${type} highlight` : `Line Line--type-${type}`;
  return <path {...props} className={className} d={lineGenerator(data)} />;
};

export default Line;
