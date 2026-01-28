import Stack from '@mui/material/Stack';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { selectionState } from '@/lib/data-map/interactions/interaction-state';
import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';

import { NbsPrioritisationPanel } from '@/config/nbs/components/NbsPrioritisationPanel';

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

export const DetailsContent: FC = () => {
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
