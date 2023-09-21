import { FC } from 'react';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { formatAbbreviations } from '@/lib/react/format-abbreviations';

import { HAZARD_COLOR_MAPS, HAZARDS_METADATA, HazardType } from '@/config/hazards/metadata';

import { RasterLegend } from '../RasterLegend';

export const HazardLegend: FC<{ viewLayer: ViewLayer<{ hazardType: HazardType }> }> = ({
  viewLayer,
}) => {
  const {
    params: { hazardType },
  } = viewLayer;

  let {
    label,
    formatValue,
    labelAbbreviations = {},
    legendAnnotation,
  } = HAZARDS_METADATA[hazardType];
  const colorMap = HAZARD_COLOR_MAPS[hazardType];

  label = formatAbbreviations(label, labelAbbreviations);

  return (
    <RasterLegend
      label={label}
      description={legendAnnotation}
      colorMap={colorMap}
      getValueLabel={formatValue}
    />
  );
};
