import { FC, useMemo } from 'react';

import { RasterCategoricalColorMap } from '@/lib/data-map/legend/RasterCategoricalLegend';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';
import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';
import {
  useRasterCategoricalColorMapValues,
  useRasterContinuousColorMapValues,
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

function getColorValueLookup(colorValues: ColorValue[]) {
  return Object.fromEntries(colorValues.map(({ color, value }, i) => [color, value]));
}

function getValueIndexLookup(colorValues: ColorValue[]) {
  return Object.fromEntries(colorValues.map(({ value }, i) => [value, i]));
}

function makeValueGetter(colorValueLookup: Record<string, any>) {
  return (color: string) => {
    return colorValueLookup?.[color];
  };
}

const RasterCategoricalHoverDescription: FC<
  {
    colorMap: RasterCategoricalColorMap;
  } & RasterHoverSharedProps
> = ({ colorMap, ...otherProps }) => {
  const colorValues = useRasterCategoricalColorMapValues(colorMap.scheme);

  const colorValueLookup = useMemo(
    () => colorValues && getColorValueLookup(colorValues),
    [colorValues],
  );

  const getValueForColor = makeValueGetter(colorValueLookup);

  return <RasterBaseHover getValueForColor={getValueForColor} {...otherProps} />;
};

const RasterContinuousHoverDescription: FC<
  {
    colorMap: RasterContinuousColorMap;
  } & RasterHoverSharedProps
> = ({ colorMap, formatValue, ...otherProps }) => {
  const { scheme, range, rangeTruncated = [false, false] } = colorMap;

  const colorValues = useRasterContinuousColorMapValues(scheme, range);
  const colorValueLookup = useMemo(
    () => colorValues && getColorValueLookup(colorValues),
    [colorValues],
  );
  const valueIndexLookup = useMemo(
    () => colorValues && getValueIndexLookup(colorValues),
    [colorValues],
  );

  const getValueForColor = makeValueGetter(colorValueLookup);

  const formatValueWithRangeTruncation = nullFormat((value: any) => {
    const i = valueIndexLookup?.[value];
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
