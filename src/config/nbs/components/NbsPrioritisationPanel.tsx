import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import { FC, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { ListFeature } from '@/lib/asset-list/use-sorted-features';
import { extendBbox } from '@/lib/bounding-box';
import { ContentWatcher } from '@/lib/mobile-tabs/content-watcher';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { NBS_ADAPTATION_TYPE_LABEL_LOOKUP } from '@/config/nbs/metadata';
import { SidePanel } from '@/details/ui/SidePanel';
import { useMapFitBounds } from '@/map/use-map-fit-bounds';
import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import {
  nbsAdaptationTypeState,
  nbsIsDataVariableContinuous,
  nbsSelectedScopeRegionBboxAtom,
  nbsSelectedScopeRegionIdAtom,
  nbsSelectedScopeRegionNameAtom,
} from '@/state/data-selection/nbs';

import { FeatureAdaptationsTable } from './FeatureAdaptationsTable';

export const NbsPrioritisationPanel: FC = () => {
  // selected scope region id / name / extent migrated to Jotai, rest is still Recoil
  const adaptationType = useRecoilValue(nbsAdaptationTypeState);
  const sidebarVisible = useRecoilValue(sidebarPathVisibilityState('adaptation/nbs'));
  const selectedRegionId = useAtomValue(nbsSelectedScopeRegionIdAtom); // migrated to Jotai
  const isContinuous = useRecoilValue(nbsIsDataVariableContinuous);
  const showPrioritisation = sidebarVisible && selectedRegionId != null && isContinuous;

  const selectedRegionName = useAtomValue(nbsSelectedScopeRegionNameAtom); // migrated to Jotai

  const scopeRegionExtent = useAtomValue(nbsSelectedScopeRegionBboxAtom); // migrated to Jotai
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
            {NBS_ADAPTATION_TYPE_LABEL_LOOKUP[adaptationType]}
            {selectedRegionName ? ` - ${selectedRegionName}` : ''}
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
