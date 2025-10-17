import { FC } from 'react';

import { d3, type D3 } from '@/lib/d3';

import { useDimensionsContext } from '../Chart';
import { formatter } from '../types/d3';
import Dimension from '../types/Dimension';
import AxisHorizontal from './AxisHorizontal';
import AxisVertical from './AxisVertical';

const defaultTickFormatter: formatter = d3.format.format(',');

type AxisProps = {
  scale: D3.scale.ScaleContinuousNumeric<number, number>;
  label?: string;
  formatTick?: formatter;
  dimension: Dimension;
};

const Axis: FC<AxisProps> = ({ dimension, formatTick = defaultTickFormatter, ...props }) => {
  const dimensions = useDimensionsContext();

  if (dimension === Dimension.X) {
    return <AxisHorizontal dimensions={dimensions} formatTick={formatTick} {...props} />;
  }

  return <AxisVertical dimensions={dimensions} formatTick={formatTick} {...props} />;
};

export default Axis;
