import { Color } from 'deck.gl';
import { FC } from 'react';

import { colorDeckToCss } from '@/lib/colors';
import { withoutAlpha } from '@/lib/deck/color';
import { FormatFunction } from '@/lib/formats';
import { ColorBox } from '@/lib/ui/data-display/ColorBox';
import { DataItem } from '@/lib/ui/data-display/DataItem';

export interface RasterBaseHoverProps {
  color: Color;
  label: string;
  getValueForColor: (color: string) => any;
  formatValue: FormatFunction;
}

/**
 *  A tooltip for raster layers that displays the color and value of the hovered pixel
 */
export const RasterBaseHover: FC<RasterBaseHoverProps> = ({
  color,
  label,
  getValueForColor,
  formatValue,
}) => {
  const colorString = colorDeckToCss(withoutAlpha(color));
  const value = getValueForColor(colorString);

  return (
    <DataItem
      label={label}
      value={
        <>
          <ColorBox color={colorString} />
          {formatValue(value)}
        </>
      }
    />
  );
};
