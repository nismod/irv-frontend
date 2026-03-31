import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { FC, Suspense } from 'react';

import { GroupedLegendLayers } from '@/lib/data-map/legend/legend-config-map';
import { LegendLoading } from '@/lib/data-map/legend/LegendLoading';

/**
 * Presentational stacked legends (Paper + dividers). Does not read `viewLayers`; pass the result of
 * `useLegendConfigMap` / `buildLegendConfigMap`.
 */
export const LegendStack: FC<{
  legendConfigs: Map<string, GroupedLegendLayers>;
}> = ({ legendConfigs }) => (
  <Paper>
    <Box p={1} maxWidth={270}>
      <Suspense fallback={'Loading legend...'}>
        <Stack gap={0.3} divider={<Divider />}>
          {Array.from(legendConfigs).map(([legendKey, { main }]) => (
            <Suspense key={legendKey} fallback={<LegendLoading />}>
              {main.renderLegend()}
            </Suspense>
          ))}
        </Stack>
      </Suspense>
    </Box>
  </Paper>
);
