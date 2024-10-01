import * as d3 from 'd3-shape';
import { FC } from 'react';

type LineProps = {
  data: any;
  xAccessor: any;
  yAccessor: any;
  isHighlighted: boolean;
  interpolation?: d3.CurveFactory;
};

const Line: FC<LineProps> = ({
  data,
  xAccessor,
  yAccessor,
  isHighlighted,
  interpolation = d3.curveMonotoneX,
  ...props
}) => {
  const lineGenerator = d3.line().x(xAccessor).y(yAccessor).curve(interpolation);

  const className = isHighlighted ? `Line Line--type-line highlight` : `Line Line--type-line`;
  return <path {...props} className={className} d={lineGenerator(data)} />;
};

export default Line;
