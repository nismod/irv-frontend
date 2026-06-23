import React, { FC, useMemo } from 'react';

import { FormatFunction } from '@/lib/formats';

import { GradientLegend } from './GradientLegend';
import { useRasterContinuousColorMapValues } from './use-raster-color-map-values';

const DEFAULT_RANGE_TRUNCATED: [boolean, boolean] = [false, false];

export interface RasterContinuousColorMap {
  type: 'continuous';
  scheme: string;
  range: [number, number];

  /**
   * If specified, determines whether the UI should indicate to the user that
   * a value at the min/max end of the range also represents values
   * below/above that end of the range.
   */
  rangeTruncated?: [boolean, boolean];
}

/** UI component displaying a legend for a raster layer.
 * Needs to be a descendant of a `RasterColorMapSourceProvider` that sets a source for fetching color map values
 **/
export const RasterContinuousLegend: FC<{
  label: string;
  description?: string;
  colorMap: RasterContinuousColorMap;
  getValueLabel: FormatFunction;
}> = React.memo(
  ({
    label,
    description,
    colorMap: { scheme, range, rangeTruncated = DEFAULT_RANGE_TRUNCATED },
    getValueLabel,
  }) => {
    const colorMapValues = useRasterContinuousColorMapValues(scheme, range);

    const colorMap = useMemo(
      () => ({ colorMapValues, rangeTruncated }),
      [colorMapValues, rangeTruncated],
    );

    return (
      <GradientLegend
        label={label}
        description={description}
        range={range}
        colorMap={colorMap}
        getValueLabel={getValueLabel}
      />
    );
  },
);
