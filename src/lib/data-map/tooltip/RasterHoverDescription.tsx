import { FC, ReactNode } from 'react';

import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterLegend';
import { useRasterColorMapValues } from '@/lib/data-map/legend/use-raster-color-map-values';

import { RasterBaseHover } from './RasterBaseHover';

export interface RasterHoverDescriptionProps {
  colorMap: RasterContinuousColorMap;
  color: [number, number, number, number];
  label: string;
  formatValue: (x: any) => ReactNode | string;
}

export const RasterHoverDescription: FC<RasterHoverDescriptionProps> = ({
  colorMap,
  ...otherProps
}) => {
  const { scheme, range, rangeTruncated } = colorMap;
  const colorMapValues = useRasterColorMapValues(scheme, range);
  const colorMapSpec = {
    colorMapValues,
    rangeTruncated,
  };

  return <RasterBaseHover colorMap={colorMapSpec} {...otherProps} />;
};
