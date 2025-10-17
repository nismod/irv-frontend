import { D3 } from '@/lib/d3';

import ChartLayout from '../types/ChartLayout';
import { formatter } from '../types/d3';

type AxisImplProps = {
  dimensions: ChartLayout;
  scale: D3.scale.ScaleContinuousNumeric<number, number>;
  label?: string;
  formatTick?: formatter;
};

export default AxisImplProps;
