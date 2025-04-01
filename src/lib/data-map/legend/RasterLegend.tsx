import React, { FC, ReactNode } from 'react';

import { useObjectMemo } from '@/lib/hooks/use-object-memo';

import { GradientLegend } from './GradientLegend';
import { useRasterColorMapValues } from './use-raster-color-map-values';

export interface RasterContinuousColorMap {
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
export const RasterLegend: FC<{
  label: string;
  description?: string;
  colorMap: RasterContinuousColorMap;
  getValueLabel: (x: any) => ReactNode | string;
}> = React.memo(
  ({
    label,
    description,
    colorMap: { scheme, range, rangeTruncated = [false, false] as [boolean, boolean] },
    getValueLabel,
  }) => {
    const colorMapValues = useRasterColorMapValues(scheme, range);

    const colorMap = useObjectMemo({
      colorMapValues,
      rangeTruncated,
    });

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
