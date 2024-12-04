import { FC } from 'react';
import { selector, useRecoilValue } from 'recoil';

import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';

import { SidePanel } from '@/details/ui/SidePanel';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import { nbsSelectedScopeRegionState } from '@/state/data-selection/nbs';

export const showPrioritisationState = selector<boolean>({
  key: 'showPrioritisationState',
  get: ({ get }) => {
    return (
      get(sidebarPathVisibilityState('adaptation/nbs')) && get(nbsSelectedScopeRegionState) != null
    );
  },
});

export const NbsPrioritisationPanel: FC = () => {
  const showPrioritisation = useRecoilValue(showPrioritisationState);
  return showPrioritisation ? (
    <>
      <ContentWatcher />
      <SidePanel>NbsPrioritisationPanel</SidePanel>
    </>
  ) : null;
};
