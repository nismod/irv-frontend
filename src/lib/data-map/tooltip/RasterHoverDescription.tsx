import { FC, useMemo } from 'react';

import { ColorValue } from '@/lib/data-map/legend/GradientLegend';
import { RasterCategoricalColorMap } from '@/lib/data-map/legend/RasterCategoricalLegend';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';
import { RasterColorMap } from '@/lib/data-map/legend/RasterLegend';
import {
  useRasterCategoricalColorMapValues,
  useRasterContinuousColorMapValues,
} from '@/lib/data-map/legend/use-raster-color-map-values';
import { FormatFunction, nullFormat } from '@/lib/formats';
import { roundValueRange, type ValueRange } from '@/lib/value-range';

import { makeRasterValueRangeLookup } from './raster-value-range';
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
  const rangeLookup = useMemo(
    () => makeRasterValueRangeLookup(colorValues ?? [], rangeTruncated),
    [colorValues, rangeTruncated],
  );

  const formatRange = nullFormat((range: ValueRange) => {
    if (range.lowerUnbounded && range.upperUnbounded) return 'Value unavailable';
    const rounded = roundValueRange(range);
    return (
      <span title="Approximate range estimated from the map color">
        ≈{' '}
        {formatValue.formatRange ? (
          formatValue.formatRange(range)
        ) : range.lowerUnbounded ? (
          <>≤{formatValue(rounded.max)}</>
        ) : range.upperUnbounded ? (
          <>≥{formatValue(rounded.min)}</>
        ) : (
          <>
            {formatValue(rounded.min)}–{formatValue(rounded.max)}
          </>
        )}
      </span>
    );
  });

  return (
    <RasterBaseHover
      getValueForColor={(color) => rangeLookup.get(color)}
      formatValue={formatRange}
      {...otherProps}
    />
  );
};
