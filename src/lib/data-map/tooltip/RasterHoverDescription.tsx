import { FC, useMemo } from 'react';

import { RasterCategoricalColorMap } from '@/lib/data-map/legend/RasterCategoricalLegend';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';
import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';
import {
  useRasterCategoricalColorMapValues,
  useRasterColorMapValues,
} from '@/lib/data-map/legend/use-raster-color-map-values';
import { FormatFunction, nullFormat } from '@/lib/formats';

import { ColorValue, formatRangeTruncation } from '../legend/GradientLegend';
import { RasterBaseHover } from './RasterBaseHover';

interface RasterHoverSharedProps {
  color: [number, number, number, number];
  label: string;
  formatValue: FormatFunction;
}
export type RasterHoverDescriptionProps = {
  colorMap: RasterColorMap;
} & RasterHoverSharedProps;

export const RasterHoverDescription: FC<RasterHoverDescriptionProps> = ({
  colorMap,
  ...otherProps
}) => {
  if (colorMap.type === 'categorical') {
    return <RasterCategoricalHoverDescription colorMap={colorMap} {...otherProps} />;
  }
  if (colorMap.type === 'continuous') {
    return <RasterContinuousHoverDescription colorMap={colorMap} {...otherProps} />;
  }

  return null;
};

function useRasterColorMapLookup(
  colorMapValues: ColorValue[],
): Record<string, { value: any; i: number }> {
  return useMemo(
    () =>
      colorMapValues &&
      Object.fromEntries(colorMapValues.map(({ value, color }, i) => [color, { value, i }])),
    [colorMapValues],
  );
}

function useGetValueForColor(colorLookup: Record<string, { value: any; i: number }>) {
  return (color: string) => {
    const { value } = colorLookup?.[color] ?? {};
    return value;
  };
}

const RasterCategoricalHoverDescription: FC<
  {
    colorMap: RasterCategoricalColorMap;
  } & RasterHoverSharedProps
> = ({ colorMap, ...otherProps }) => {
  const colorValues = useRasterCategoricalColorMapValues(colorMap.scheme);

  const colorValueLookup = useRasterColorMapLookup(colorValues);

  const getValueForColor = useGetValueForColor(colorValueLookup);

  return <RasterBaseHover getValueForColor={getValueForColor} {...otherProps} />;
};

const RasterContinuousHoverDescription: FC<
  {
    colorMap: RasterContinuousColorMap;
  } & RasterHoverSharedProps
> = ({ colorMap, formatValue, ...otherProps }) => {
  const { scheme, range, rangeTruncated = [false, false] } = colorMap;
  const colorMapValues = useRasterColorMapValues(scheme, range);
  const colorValueLookup = useRasterColorMapLookup(colorMapValues);

  const getValueForColor = useGetValueForColor(colorValueLookup);

  const formatValueWithRangeTruncation = nullFormat((value: any) => {
    const { i } = colorValueLookup?.[value] ?? {};
    return formatRangeTruncation(formatValue(value), i, rangeTruncated);
  });

  return (
    <RasterBaseHover
      getValueForColor={getValueForColor}
      formatValue={formatValueWithRangeTruncation}
      {...otherProps}
    />
  );
};
