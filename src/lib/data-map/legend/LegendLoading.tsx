import { GradientLegend } from './GradientLegend';

export const LegendLoading = () => {
  return (
    <GradientLegend label="Loading..." colorMap={null} range={[0, 1]} getValueLabel={() => ''} />
  );
};
