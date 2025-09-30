import { Box, Divider, Paper, Stack } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { LegendLoading } from '@/lib/data-map/legend/LegendLoading';
import { ViewLayer } from '@/lib/data-map/view-layers';
import { ViewLayerSlot } from '@/lib/data-map/ViewLayerSlot';
import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';

import { viewLayersState } from '@/state/layers/view-layers';

declare module '@/lib/data-map/view-layers' {
  interface KnownViewLayerSlots {
    Legend?: NoProps;
  }
}

export const ViewLayerLegendOld = <ParamsT extends object, StateT extends object>({
  viewLayer,
}: {
  viewLayer: ViewLayer<ParamsT, StateT>;
}): JSX.Element => {
  switch (viewLayer.type) {
    case 'old':
      return <>{viewLayer.renderLegend?.()}</>;
    case 'new': {
      throw new Error('ViewLayerLegend only supports old style view layers');
    }
  }
};

/**
 * An object holding information about multiple view layers represented by one legend element
 */
interface GroupedLegendLayers {
  /**
   * The main view layer representing the group of layers.
   */
  main: ViewLayer;
  /**
   * All view layers represented by this legend. Could be used in the future if some legends need information about all layers.
   */
  all: ViewLayer[];
}

export const MapLegendContent: FC = () => {
  const viewLayers = useRecoilValue(viewLayersState);

  // use Map because it's guaranteed to remember insertion order
  const oldLayerLegendConfigs = new Map<string, GroupedLegendLayers>();

  // iterate over view layers that have a legend, and save the first layer for each legend grouping (based on `viewLayer.legendKey`)
  viewLayers
    .filter((vl) => vl.type === 'old')
    .forEach((viewLayer) => {
      if (viewLayer.renderLegend) {
        const { id, legendKey = id } = viewLayer;

        if (!oldLayerLegendConfigs.has(legendKey)) {
          oldLayerLegendConfigs.set(legendKey, { main: viewLayer, all: [] });
        }

        oldLayerLegendConfigs.get(legendKey).all.push(viewLayer);
      }
    });

  const newLayers = viewLayers.filter((layer) => layer.type === 'new');

  return oldLayerLegendConfigs.size || newLayers.length ? (
    <>
      <ContentWatcher />
      <Paper>
        <Box p={1} maxWidth={270}>
          <Suspense fallback={'Loading legend...'}>
            <Stack gap={0.3} divider={<Divider />}>
              {Array.from(oldLayerLegendConfigs).map(([legendKey, { main }]) => (
                <Suspense key={legendKey} fallback={<LegendLoading />}>
                  {/* use main layer for each legend grouping to render the legend */}
                  <ViewLayerLegendOld viewLayer={main} />
                </Suspense>
              ))}
              {newLayers.map((layer) => (
                <Suspense key={layer.id} fallback={<LegendLoading />}>
                  <ViewLayerSlot slot="Legend" slotProps={{}} viewLayer={layer} />
                </Suspense>
              ))}
            </Stack>
          </Suspense>
        </Box>
      </Paper>
    </>
  ) : null;
};

export const MapLegend: FC = () => (
  <Suspense fallback={null}>
    <MapLegendContent />
  </Suspense>
);
