import { FC } from 'react';

import { FormatFunction } from '@/lib/formats';

import { RasterCategoricalColorMap, RasterCategoricalLegend } from './RasterCategoricalLegend';
import { RasterContinuousColorMap, RasterContinuousLegend } from './RasterContinuousLegend';

export type RasterColorMap = RasterContinuousColorMap | RasterCategoricalColorMap;

export interface RasterLegendProps {
  label: string;
  description?: string;
  colorMap: RasterColorMap;
  getValueLabel: FormatFunction;
}

export const RasterLegend: FC<RasterLegendProps> = ({ colorMap, ...props }) => {
  if (colorMap.type === 'categorical') {
    return <RasterCategoricalLegend {...props} colorMap={colorMap} />;
  }

  if (colorMap.type === 'continuous') {
    return <RasterContinuousLegend {...props} colorMap={colorMap} />;
  }

  return null;
};
