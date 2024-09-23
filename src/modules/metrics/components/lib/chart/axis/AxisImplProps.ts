import ChartLayout from '../types/ChartLayout';

type AxisImplProps = {
  dimensions: ChartLayout;
  scale: any; // D3 function type
  label?: string;
  formatTick?: any; // D3 function type
};

export default AxisImplProps;
