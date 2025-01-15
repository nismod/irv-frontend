import { Box, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { selector, useRecoilValue } from 'recoil';

import { ListFeature } from '@/lib/asset-list/use-sorted-features';
import { extendBbox } from '@/lib/bounding-box';
import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { SidePanel } from '@/details/ui/SidePanel';
import { useMapFitBounds } from '@/map/use-map-fit-bounds';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import {
  nbsIsDataVariableContinuous,
  nbsSelectedScopeRegionBboxState,
  nbsSelectedScopeRegionIdState,
  nbsSelectedScopeRegionNameState,
} from '@/state/data-selection/nbs';

import { FeatureAdaptationsTable } from './FeatureAdaptationsTable';

export const showPrioritisationState = selector<boolean>({
  key: 'showPrioritisationState',
  get: ({ get }) => {
    return (
      get(sidebarPathVisibilityState('adaptation/nbs')) &&
      get(nbsSelectedScopeRegionIdState) != null &&
      get(nbsIsDataVariableContinuous)
    );
  },
});

export const NbsPrioritisationPanel: FC = () => {
  const showPrioritisation = useRecoilValue(showPrioritisationState);
  const selectedRegionName = useRecoilValue(nbsSelectedScopeRegionNameState);

  const scopeRegionExtent = useRecoilValue(nbsSelectedScopeRegionBboxState);
  const { setMapFitBounds } = useMapFitBounds();

  function handleZoomInFeature(feature: ListFeature) {
    if (feature?.bbox) {
      setMapFitBounds(extendBbox(feature.bbox, 1));
    }
  }

  function handleZoomOutRegion() {
    if (scopeRegionExtent) {
      setMapFitBounds(scopeRegionExtent);
    }
  }

  /**
   * Update the map bounds to the selected region, even if the prioritisation panel is not visible.
   */
  useEffect(() => {
    if (scopeRegionExtent) {
      setMapFitBounds(scopeRegionExtent);
    }
  }, [setMapFitBounds, scopeRegionExtent]);

  return showPrioritisation ? (
    <SidePanel>
      <ContentWatcher />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box px={2} pt={2}>
          <Typography variant="h6" gutterBottom>
            Adaptation Options{selectedRegionName ? ` - ${selectedRegionName}` : ''}
          </Typography>
        </Box>
        <Box height="60vh" position="relative">
          <FeatureAdaptationsTable
            onZoomInFeature={handleZoomInFeature}
            onZoomOutRegion={handleZoomOutRegion}
          />
        </Box>
      </ErrorBoundary>
    </SidePanel>
  ) : null;
};
