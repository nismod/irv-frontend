import React from 'react';

import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { nullFormat } from '@/lib/formats';
import { formatAbbreviations } from '@/lib/react/format-abbreviations';

import { HAZARDS_METADATA, HazardType } from './metadata';
import { getHazardDataPath, getHazardDataUrl } from './source';

export function getHazardId(hazardType: HazardType, hazardParams: any) {
  return getHazardDataPath({ hazardType, metric: 'occurrence', hazardParams });
}

export function hazardViewLayer(hazardType: string, hazardParams: any): ViewLayer {
  const isCyclone = hazardType === 'cyclone' || hazardType === 'cyclone_iris';
  const magFilter = isCyclone ? 'nearest' : 'linear';

  const id = hazardType;
  const deckId = getHazardId(hazardType as HazardType, hazardParams);
  const metric = 'occurrence';

  const metadata = HAZARDS_METADATA[hazardType as HazardType];
  const colorMap = metadata.getColorMap(hazardParams);
  const formatFn = metadata.getFormatFn(hazardParams);
  const tooltipFormatFn = nullFormat(formatFn, '');
  const { label, labelAbbreviations, legendAnnotation } = metadata;
  const legendLabel = labelAbbreviations ? formatAbbreviations(label, labelAbbreviations) : label;

  const data = getHazardDataUrl(
    { hazardType: hazardType as HazardType, metric, hazardParams },
    colorMap,
  );

  return {
    id,
    interactionGroup: 'hazards',
    params: { hazardType, hazardParams, metric },
    fn: ({ deckProps }) => {
      return rasterTileLayer(
        {
          textureParameters: {
            magFilter,
          },
          opacity: isCyclone ? 0.6 : 1,

          // TODO: tweak transparentColor to tweak border color / transparent layer tint

          transparentColor: [255, 255, 255, 0],
        },
        deckProps,
        {
          id: `${id}@${deckId}`, // follow the convention viewLayerId@deckLayerId
          data,
          refinementStrategy: 'no-overlap',
        },
      );
    },
    renderLegend() {
      return React.createElement(RasterLegend, {
        key: hazardType,
        colorMap,
        label: legendLabel,
        description: legendAnnotation,
        getValueLabel: formatFn,
      });
    },
    renderTooltip(hover: InteractionTarget<RasterTarget>) {
      return React.createElement(RasterHoverDescription, {
        color: hover.target.color,
        colorMap,
        label: label,
        formatValue: tooltipFormatFn,
      });
    },
  };
}
