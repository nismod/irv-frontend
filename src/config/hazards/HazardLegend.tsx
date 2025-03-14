import { FC } from 'react';

import { RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { formatAbbreviations } from '@/lib/react/format-abbreviations';

import { HAZARD_COLOR_MAPS, HAZARDS_METADATA, HazardType } from '@/config/hazards/metadata';

export const HazardLegend: FC<{ viewLayer: ViewLayer<{ hazardType: HazardType }> }> = ({
  viewLayer,
}) => {
  const {
    params: { hazardType },
  } = viewLayer;

  const metadata = HAZARDS_METADATA[hazardType];
  let { label } = metadata;
  const { formatValue, labelAbbreviations = {}, legendAnnotation } = metadata;

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
