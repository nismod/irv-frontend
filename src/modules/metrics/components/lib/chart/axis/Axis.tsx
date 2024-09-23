import * as d3 from 'd3';
import { FC } from 'react';

import { useDimensionsContext } from '../Chart';
import Dimension from '../types/Dimension';
import AxisHorizontal from './AxisHorizontal';
import AxisVertical from './AxisVertical';

const defaultTickFormatter = d3.format(',');

const axisByDimension = (dimension: Dimension) => {
  if (dimension === Dimension.X) {
    return AxisHorizontal;
  }

  return AxisVertical;
};

type AxisProps = {
  scale: any; // D3 function
  label?: string;
  formatTick?: any; // D3 function
  dimension: Dimension;
};

const Axis: FC<AxisProps> = ({ dimension, formatTick = defaultTickFormatter, ...props }) => {
  const dimensions = useDimensionsContext();

  const Component = axisByDimension(dimension);
  if (!Component) return null;

  return <Component dimensions={dimensions} formatTick={formatTick} {...props} />;
};

export default Axis;
