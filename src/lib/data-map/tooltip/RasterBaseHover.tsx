import { Color } from 'deck.gl';
import { FC, ReactNode, useMemo } from 'react';

import { colorDeckToCss } from '@/lib/colors';
import {
  ColorMapValues,
  ColorValue,
  formatRangeTruncation,
} from '@/lib/data-map/legend/GradientLegend';
import { withoutAlpha } from '@/lib/deck/color';
import { ColorBox } from '@/lib/ui/data-display/ColorBox';
import { DataItem } from '@/lib/ui/data-display/DataItem';

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

export interface RasterBaseHoverProps {
  colorMap: ColorMapValues;
  color: Color;
  label: string;
  formatValue: (x: any) => ReactNode | string;
}

/**
 *  A tooltip for raster layers that displays the color and value of the hovered pixel
 */
export const RasterBaseHover: FC<RasterBaseHoverProps> = ({
  colorMap,
  color,
  label,
  formatValue,
}) => {
  const { colorMapValues, rangeTruncated = [false, false] } = colorMap;
  const rasterValueLookup = useRasterColorMapLookup(colorMapValues);

  const colorString = colorDeckToCss(withoutAlpha(color));
  const { value, i } = rasterValueLookup?.[colorString] ?? {};
  return (
    <DataItem
      label={label}
      value={
        <>
          <ColorBox color={colorString} />
          {value == null
            ? formatValue(value)
            : formatRangeTruncation(formatValue(value), i, rangeTruncated)}
        </>
      }
    />
  );
};
