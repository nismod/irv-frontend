import { FC } from 'react';

import { d3, type D3 } from '@/lib/d3';

import { useDimensionsContext } from '../Chart';
import { formatter } from '../types/d3';
import Dimension from '../types/Dimension';
import AxisHorizontal from './AxisHorizontal';
import AxisVertical from './AxisVertical';

const defaultTickFormatter: formatter = d3.format.format(',');

const axisByDimension = (dimension: Dimension) => {
  if (dimension === Dimension.X) {
    return AxisHorizontal;
  }

  return AxisVertical;
};

type AxisProps = {
  scale: D3.scale.ScaleContinuousNumeric<number, number>;
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
