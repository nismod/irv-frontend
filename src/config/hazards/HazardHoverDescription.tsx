import { FC } from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';

import { HAZARD_COLOR_MAPS, HAZARDS_METADATA, HazardType } from '@/config/hazards/metadata';

export const HazardHoverDescription: FC<{ hoveredObject: InteractionTarget<RasterTarget> }> = ({
  hoveredObject,
}) => {
  const {
    target: { color },
    viewLayer: {
      params: { hazardType },
    },
  } = hoveredObject;
  const { label, formatValue } = HAZARDS_METADATA[hazardType as HazardType];

  return (
    <RasterHoverDescription
      color={color}
      colorMap={HAZARD_COLOR_MAPS[hazardType as HazardType]}
      label={label}
      formatValue={(x) => (x != null ? formatValue(x) : '')}
    />
  );
};
