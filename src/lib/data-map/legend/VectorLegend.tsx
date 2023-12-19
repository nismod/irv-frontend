import { FC, useMemo } from 'react';

import { colorScaleValues } from '@/lib/color-map';

import { ColorMap, FormatConfig } from '../view-layers';
import { GradientLegend } from './GradientLegend';

/** UI component displaying a legend for a vector layer */
export const VectorLegend: FC<{
  /** Vector color map spec */
  colorMap: ColorMap;
  /** Config format for the legend */
  legendFormatConfig: FormatConfig;
}> = ({ colorMap, legendFormatConfig }) => {
  const { colorSpec, fieldSpec } = colorMap;
  const colorMapValues = useMemo(() => colorScaleValues(colorSpec, 255), [colorSpec]);

  const { getDataLabel, getValueFormatted } = legendFormatConfig;

  const label = getDataLabel(fieldSpec);
  const getValueLabel = useMemo(
    () => (value) => getValueFormatted(value, fieldSpec),
    [fieldSpec, getValueFormatted],
  );

  const colorMapProp = useMemo(
    () => ({
      colorMapValues,
      rangeTruncated: [false, false] as [boolean, boolean],
    }),
    [colorMapValues],
  );

  return (
    <GradientLegend
      label={label}
      range={colorSpec.range}
      colorMap={colorMapProp}
      getValueLabel={getValueLabel}
    />
  );
};
