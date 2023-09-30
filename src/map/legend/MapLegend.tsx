import { Box, Divider, Paper, Stack } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { MobileTabContentWatcher } from '@/pages/map/layouts/mobile/tab-has-content';
import { viewLayersFlatState } from '@/state/layers/view-layers-flat';

import { GradientLegend } from './GradientLegend';

const LegendLoading = () => {
  return (
    <GradientLegend label="Loading..." colorMap={null} range={[0, 1]} getValueLabel={() => ''} />
  );
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

export const MapLegend: FC<{}> = () => {
  const viewLayers = useRecoilValue(viewLayersFlatState);

  // use Map because it's guaranteed to remember insertion order
  const legendConfigs = new Map<string, GroupedLegendLayers>();

  // iterate over view layers that have a legend, and save the first layer for each legend grouping (based on `viewLayer.legendKey`)
  viewLayers.forEach((viewLayer) => {
    if (viewLayer.renderLegend) {
      const { id, legendKey = id } = viewLayer;

      if (!legendConfigs.has(legendKey)) {
        legendConfigs.set(legendKey, { main: viewLayer, all: [] });
      }

      legendConfigs.get(legendKey).all.push(viewLayer);
    }
  });

  return legendConfigs.size ? (
    <>
      <MobileTabContentWatcher tabId="legend" />
      <Paper>
        <Box p={1} maxWidth={270}>
          <Suspense fallback={'Loading legend...'}>
            <Stack gap={0.3} divider={<Divider />}>
              {Array.from(legendConfigs).map(([legendKey, { main }]) => (
                <Suspense key={legendKey} fallback={<LegendLoading />}>
                  {/* use main layer for each legend grouping to render the legend */}
                  {main.renderLegend()}
                </Suspense>
              ))}
            </Stack>
          </Suspense>
        </Box>
      </Paper>
    </>
  ) : null;
};
