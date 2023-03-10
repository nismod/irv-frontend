import { Stack } from '@mui/material';
import { useRecoilValue } from 'recoil';

import { selectionState } from '@/lib/data-map/interactions/interaction-state';

import { MobileTabContentWatcher } from '@/pages/map/layouts/mobile/tab-has-content';

import { DetailsPanel } from './ui/DetailsPanel';

const InteractionGroupDetails = ({ group }) => {
  const selection = useRecoilValue(selectionState(group));

  return selection?.viewLayer.renderDetails ? (
    <>
      <MobileTabContentWatcher tabId="details" />
      <DetailsPanel interactionGroup={group}>
        {selection.viewLayer.renderDetails(selection)}
      </DetailsPanel>
    </>
  ) : null;
};

export const DetailsContent = () => {
  return (
    <Stack spacing={2}>
      <InteractionGroupDetails group="assets" />
      <InteractionGroupDetails group="wdpa" />
      <InteractionGroupDetails group="hdi" />
      <InteractionGroupDetails group="rexp" />
    </Stack>
  );
};
