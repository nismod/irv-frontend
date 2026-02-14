import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { selectionState } from '@/lib/data-map/interactions/interaction-state';
import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';

import { NbsPrioritisationPanel } from '@/config/nbs/components/NbsPrioritisationPanel';
import { mapInteractionModeState } from '@/state/map-view/map-interaction-state';

import { PixelDrillerDetailsPanel } from './pixel-driller/PixelDrillerDetailsPanel';
import { DetailsPanel } from './ui/DetailsPanel';

declare module '@/lib/data-map/view-layers' {
  interface KnownViewLayerSlots {
    Details?: NoProps;
  }
}

const InteractionGroupDetails = ({ group }) => {
  const selection = useRecoilValue(selectionState(group));

  return selection?.viewLayer.renderDetails ? (
    <>
      <ContentWatcher />
      <DetailsPanel interactionGroup={group}>
        {selection.viewLayer.renderDetails(selection)}
      </DetailsPanel>
    </>
  ) : null;
};

/**
 * Main details content component.
 * When pixel driller mode is enabled, shows pixel driller details panel.
 * Otherwise, shows vector feature selection details.
 */
export const DetailsContent: FC = () => {
  const interactionMode = useRecoilValue(mapInteractionModeState);
  const isPixelDrillerMode = interactionMode === 'pixel-driller';

  // When pixel driller mode is enabled, show only the pixel driller panel
  if (isPixelDrillerMode) {
    return (
      <Box
        sx={{
          height: '100%',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ContentWatcher />
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <PixelDrillerDetailsPanel />
        </Box>
      </Box>
    );
  }

  // Otherwise, show the normal vector selection details
  return (
    <Stack spacing={2}>
      <InteractionGroupDetails group="assets" />
      <NbsPrioritisationPanel />
      <InteractionGroupDetails group="wdpa" />
      <InteractionGroupDetails group="hdi" />
      <InteractionGroupDetails group="rexp" />
    </Stack>
  );
};
