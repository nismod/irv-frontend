import React, { FC, useMemo } from 'react';

import { FormatFunction } from '@/lib/formats';

import { CategoricalLegend, CategoricalLegendItem } from './CategoricalLegend';
import { useRasterCategoricalColorMapValues } from './use-raster-color-map-values';

export interface RasterCategoricalColorMap {
  type: 'categorical';
  scheme?: string;
}

/** UI component displaying a legend for a categorical raster layer.
 * Needs to be a descendant of a `RasterColorMapSourceProvider` that sets a source for fetching color map values
 **/
export const RasterCategoricalLegend: FC<{
  label: string;
  description?: string;
  colorMap: RasterCategoricalColorMap;
  getValueLabel: FormatFunction;
}> = React.memo(({ label, description, colorMap: { scheme }, getValueLabel }) => {
  const colorMapValues = useRasterCategoricalColorMapValues(scheme);
  const items = useMemo(() => {
    return colorMapValues?.map(
      (item) =>
        ({
          color: item.color,
          value: item.value,
          label: getValueLabel(item.value),
          shape: 'square',
        }) satisfies CategoricalLegendItem,
    );
  }, [colorMapValues, getValueLabel]);

  return items ? <CategoricalLegend label={label} description={description} items={items} /> : null;
});
