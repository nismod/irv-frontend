import { ReactNode, Suspense, useEffect } from 'react';
import { MapMouseEvent } from 'react-map-gl/maplibre';
import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { BoundingBox } from '@/lib/bounding-box';
import { BaseMap } from '@/lib/data-map/BaseMap';
import { DataMap } from '@/lib/data-map/DataMap';
import { DataMapTooltip } from '@/lib/data-map/DataMapTooltip';
import { MapBoundsFitter } from '@/lib/map/MapBoundsFitter';
import { LocationMarker } from '@/lib/map/pixel-driller/LocationMarker';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';

import { interactionGroupsState } from '@/state/layers/interaction-groups';
import { viewLayersState } from '@/state/layers/view-layers';
import { viewLayersParamsState } from '@/state/layers/view-layers-params';
import {
  mapInteractionModeState,
  pixelDrillerClickLocationState,
} from '@/state/map-view/map-interaction-state';
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
  const interactionMode = useRecoilValue(mapInteractionModeState);
  const [clickLocation, setClickLocation] = useRecoilState(pixelDrillerClickLocationState);

  const fitBounds = useRecoilValue(mapFitBoundsState);

  const resetFitBounds = useResetRecoilState(mapFitBoundsState);
  useEffect(() => {
    // reset map fit bounds whenever MapView is mounted
    resetFitBounds();
  }, [resetFitBounds]);

  // Clear click location when pixel-driller mode is turned off
  useEffect(() => {
    if (interactionMode !== 'pixel-driller') {
      setClickLocation(null);
    }
  }, [interactionMode, setClickLocation]);

  const handleMapClick = (event: MapMouseEvent) => {
    if (interactionMode === 'pixel-driller') {
      setClickLocation({
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
      });
    }
  };

  const isPixelDrillerMode = interactionMode === 'pixel-driller';

  return (
    <BaseMap
      mapStyle={mapStyle}
      viewState={viewState}
      onViewState={setViewState}
      onClick={isPixelDrillerMode ? handleMapClick : undefined}
    >
      <DataMap
        beforeId={firstLabelId}
        viewLayers={viewLayers}
        viewLayersParams={viewLayersParams}
        interactionGroups={interactionGroups}
        disableOnClick={isPixelDrillerMode}
      />
      <MapBoundsFitter boundingBox={fitBounds} />
      {clickLocation && <LocationMarker lng={clickLocation.lng} lat={clickLocation.lat} />}
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
