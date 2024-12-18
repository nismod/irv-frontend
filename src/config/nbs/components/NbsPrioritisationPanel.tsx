import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { selector, useRecoilValue } from 'recoil';

import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { SidePanel } from '@/details/ui/SidePanel';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import {
  nbsSelectedScopeRegionIdState,
  nbsShouldMapAdaptationDataState,
} from '@/state/data-selection/nbs';

import { FeatureAdaptationsTable } from './FeatureAdaptationsTable';

export const showPrioritisationState = selector<boolean>({
  key: 'showPrioritisationState',
  get: ({ get }) => {
    return (
      get(sidebarPathVisibilityState('adaptation/nbs')) &&
      get(nbsSelectedScopeRegionIdState) != null &&
      get(nbsShouldMapAdaptationDataState)
    );
  },
});

export const NbsPrioritisationPanel: FC = () => {
  const showPrioritisation = useRecoilValue(showPrioritisationState);
  return showPrioritisation ? (
    <SidePanel>
      <ContentWatcher />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box px={2} pt={2}>
          <Typography variant="h6" gutterBottom>
            Adaptation Options
          </Typography>
        </Box>
        <Box height="60vh" position="relative">
          <FeatureAdaptationsTable />
        </Box>
      </ErrorBoundary>
    </SidePanel>
  ) : null;
};
