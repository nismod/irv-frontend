import { FC } from 'react';

import { d3, type D3 } from '@/lib/d3';

type LineProps = {
  data: any;
  xAccessor: any;
  yAccessor: any;
  isHighlighted: boolean;
  interpolation?: D3.shape.CurveFactory;
};

const Line: FC<LineProps> = ({
  data,
  xAccessor,
  yAccessor,
  isHighlighted,
  interpolation = d3.shape.curveMonotoneX,
  ...props
}) => {
  const lineGenerator = d3.shape.line().x(xAccessor).y(yAccessor).curve(interpolation);

  const className = isHighlighted ? `Line Line--type-line highlight` : `Line Line--type-line`;
  return <path {...props} className={className} d={lineGenerator(data)} />;
};

export default Line;
