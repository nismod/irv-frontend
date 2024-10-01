import * as d3 from 'd3-format';
import * as d3Scale from 'd3-scale';
import { FC } from 'react';

import { useDimensionsContext } from '../Chart';
import { formatter } from '../types/d3';
import Dimension from '../types/Dimension';
import AxisHorizontal from './AxisHorizontal';
import AxisVertical from './AxisVertical';

const defaultTickFormatter: formatter = d3.format(',');

const axisByDimension = (dimension: Dimension) => {
  if (dimension === Dimension.X) {
    return AxisHorizontal;
  }

  return AxisVertical;
};

type AxisProps = {
  scale: d3Scale.ScaleContinuousNumeric<number, number>;
  label?: string;
  formatTick?: formatter;
  dimension: Dimension;
};

const Axis: FC<AxisProps> = ({ dimension, formatTick = defaultTickFormatter, ...props }) => {
  const dimensions = useDimensionsContext();

  const Component = axisByDimension(dimension);
  if (!Component) return null;

  return <Component dimensions={dimensions} formatTick={formatTick} {...props} />;
};

export default Axis;
