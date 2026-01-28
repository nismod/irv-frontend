import { InteractionTarget, RasterTarget } from '@/lib/data-map/interactions/types';
import { RasterContinuousColorMap } from '@/lib/data-map/legend/RasterContinuousLegend';
import { RasterLegend } from '@/lib/data-map/legend/RasterLegend';
import { useViewLayerState } from '@/lib/data-map/react/view-layer-state';
import { RasterHoverDescription } from '@/lib/data-map/tooltip/RasterHoverDescription';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { rasterTileLayer } from '@/lib/deck/layers/raster-tile-layer';
import { makeValueFormat } from '@/lib/formats';

import { SOURCES } from '../sources';

export const COLOR_MAP: RasterContinuousColorMap = {
  type: 'continuous',
  scheme: 'RdYlGn',
  range: [0, 1],
  // HDI should always be 0-1. "False" prevents showing >1 on rounding (e.g., Zurich)
  rangeTruncated: [false, false],
};

function getDataUrl() {
  return SOURCES.raster.getUrl({
    path: 'social/hdi',
    ...COLOR_MAP,
  });
}

type RasterHoverState = { hover: InteractionTarget<RasterTarget> };

type HdiGridState = RasterHoverState;

function rasterHoverState(): RasterHoverState {
  return { hover: null };
}

export function hdiGridViewLayer(): ViewLayer<{}, HdiGridState> {
  const label = 'Human Development Index';
  const formatValue = makeValueFormat((x) => x, { maximumFractionDigits: 2 });

  return {
    type: 'new',
    id: 'hdi-grid',
    interactions: new RasterInteractions({
      group: null,
    }),
    state: { ...rasterHoverState() },
    renderMapLayers({ autoProps, viewState: { zoom } }) {
      return rasterTileLayer(
        {
          textureParameters: {
            magFilter: zoom >= 7 ? 'nearest' : 'linear',
          },
          transparentColor: [255, 255, 255, 0],
        },
        autoProps,
        {
          data: getDataUrl(),
          refinementStrategy: 'no-overlap',
        },
      );
    },
    slots: {
      Legend: () => {
        return <RasterLegend label={label} colorMap={COLOR_MAP} getValueLabel={formatValue} />;
      },
      Tooltip: () => {
        const [
          {
            hover: {
              target: { color },
            },
          },
        ] = useViewLayerState<HdiGridState>();

        return (
          <RasterHoverDescription
            color={color}
            label={label}
            colorMap={COLOR_MAP}
            formatValue={formatValue}
          />
        );
      },
    },
  };
}
