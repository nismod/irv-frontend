import { ReactNode, Suspense, useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { BoundingBox } from '@/lib/bounding-box';
import { BaseMap } from '@/lib/data-map/BaseMap';
import { DataMap } from '@/lib/data-map/DataMap';
import { DataMapTooltip } from '@/lib/data-map/DataMapTooltip';
import { MapBoundsFitter } from '@/lib/map/MapBoundsFitter';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { interactionGroupsState } from '@/state/layers/interaction-groups';
import { viewLayersState } from '@/state/layers/view-layers';
import { viewLayersParamsState } from '@/state/layers/view-layers-params';
import { mapViewStateState, useSyncMapUrl } from '@/state/map-view/map-view-state';

import { backgroundState, showLabelsState } from './layers/layers-state';
import { TooltipContent } from './tooltip/TooltipContent';
import { useBasemapStyle } from './use-basemap-style';

export const mapFitBoundsState = atom<BoundingBox>({
  key: 'mapFitBoundsState',
  default: null,
});

const MapViewContent = ({ children }) => {
  const [viewState, setViewState] = useRecoilState(mapViewStateState);
  useSyncMapUrl();

  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const { mapStyle, firstLabelId } = useBasemapStyle(background, showLabels);

  const viewLayers = useRecoilValue(viewLayersState);
  const viewLayersParams = useRecoilValue(viewLayersParamsState);

  const interactionGroups = useRecoilValue(interactionGroupsState);

  const fitBounds = useRecoilValue(mapFitBoundsState);

  const resetFitBounds = useResetRecoilState(mapFitBoundsState);
  useEffect(() => {
    // reset map fit bounds whenever MapView is mounted
    resetFitBounds();
  }, [resetFitBounds]);

  return (
    <BaseMap mapStyle={mapStyle} viewState={viewState} onViewState={setViewState}>
      <DataMap
        beforeId={firstLabelId}
        viewLayers={viewLayers}
        viewLayersParams={viewLayersParams}
        interactionGroups={interactionGroups}
      />
      <MapBoundsFitter boundingBox={fitBounds} />
      <DataMapTooltip>
        <TooltipContent />
      </DataMapTooltip>
      {children}
    </BaseMap>
  );
};

export const MapView = ({ children }: { children?: ReactNode }) => (
  <ErrorBoundary message="There was a problem displaying the map." justifyErrorContent="center">
    <Suspense fallback={null}>
      <MapViewContent>{children}</MapViewContent>
    </Suspense>
  </ErrorBoundary>
);
