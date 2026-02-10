import { ReactNode, Suspense, useEffect, useRef } from 'react';
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
  MapInteractionMode,
  mapInteractionModeState,
  pixelDrillerClickLocationState,
} from '@/state/map-view/map-interaction-state';
import { mapViewStateState, useSyncMapUrl } from '@/state/map-view/map-view-state';
import { pixelDrillerSiteUrlState } from '@/state/map-view/pixel-driller-url-state';

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
  const [interactionMode, setInteractionMode] = useRecoilState(mapInteractionModeState);
  const [clickLocation, setClickLocation] = useRecoilState(pixelDrillerClickLocationState);
  const [siteParam, setSiteParam] = useRecoilState(pixelDrillerSiteUrlState);

  const fitBounds = useRecoilValue(mapFitBoundsState);

  const prevInteractionModeRef = useRef<MapInteractionMode | null>(null);

  const resetFitBounds = useResetRecoilState(mapFitBoundsState);
  useEffect(() => {
    // reset map fit bounds whenever MapView is mounted
    resetFitBounds();
  }, [resetFitBounds]);

  // Clear click location and URL param when pixel-driller mode is turned off,
  // but only when transitioning *from* pixel-driller to another mode.
  useEffect(() => {
    const prev = prevInteractionModeRef.current;

    if (prev === 'pixel-driller' && interactionMode !== 'pixel-driller') {
      setClickLocation(null);
      setSiteParam(null);
    }

    prevInteractionModeRef.current = interactionMode;
  }, [interactionMode, setClickLocation, setSiteParam]);

  // Keep the "site" URL param in sync with the current pixel-driller click location
  useEffect(() => {
    if (interactionMode !== 'pixel-driller') {
      return;
    }
    if (!clickLocation) {
      return;
    }

    const { lat, lng } = clickLocation;
    setSiteParam(`${lat.toFixed(6)},${lng.toFixed(6)}`);
  }, [interactionMode, clickLocation, setSiteParam]);

  // When a "site" URL param is present, enable pixel-driller mode and restore the click location.
  // This effect only reacts to changes in the URL param itself, so it won't
  // fight with the user explicitly toggling the interaction mode.
  useEffect(() => {
    if (!siteParam) {
      return;
    }

    const [latStr, lngStr] = siteParam.split(',');
    const lat = Number(latStr);
    const lng = Number(lngStr);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    setInteractionMode('pixel-driller');
    setClickLocation({ lng, lat });
  }, [siteParam, setInteractionMode, setClickLocation]);

  const handleMapClick = (event: MapMouseEvent) => {
    if (interactionMode === 'pixel-driller') {
      const lng = event.lngLat.lng;
      const lat = event.lngLat.lat;

      setClickLocation({
        lng,
        lat,
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
