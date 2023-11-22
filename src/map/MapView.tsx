import { Suspense, useCallback, useEffect } from 'react';
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';

import { BoundingBox } from '@/lib/bounding-box';
import { BaseMap } from '@/lib/data-map/BaseMap';
import { DataMap } from '@/lib/data-map/DataMap';
import { DataMapTooltip } from '@/lib/data-map/DataMapTooltip';
import {
  MapHudAttributionControl,
  MapHudNavigationControl,
  MapHudScaleControl,
} from '@/lib/map/hud/mapbox-controls';
import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';
import { MapBoundsFitter } from '@/lib/map/MapBoundsFitter';
import { MapSearch } from '@/lib/map/place-search/MapSearch';
import { PlaceSearchResult } from '@/lib/map/place-search/use-place-search';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';
import { withProps } from '@/lib/react/with-props';

import { interactionGroupsState } from '@/state/layers/interaction-groups';
import { viewLayersFlatState } from '@/state/layers/view-layers-flat';
import { useSaveViewLayers, viewLayersParamsState } from '@/state/layers/view-layers-params';
import { mapViewStateState, useSyncMapUrl } from '@/state/map-view/map-view-state';
import { globalStyleVariables } from '@/theme';
import { useIsMobile } from '@/use-is-mobile';

import { backgroundState, showLabelsState } from './layers/layers-state';
import { MapLayerSelection } from './layers/MapLayerSelection';
import { MapLegend } from './legend/MapLegend';
import { TooltipContent } from './tooltip/TooltipContent';
import { useBasemapStyle } from './use-basemap-style';

export const mapFitBoundsState = atom<BoundingBox>({
  key: 'mapFitBoundsState',
  default: null,
});

const AppPlaceSearch = () => {
  const setFitBounds = useSetRecoilState(mapFitBoundsState);

  const handleSelectedSearchResult = useCallback(
    (result: PlaceSearchResult) => {
      setFitBounds(result.boundingBox);
    },
    [setFitBounds],
  );

  return <MapSearch onSelectedResult={handleSelectedSearchResult} />;
};

const AppNavigationControl = withProps(MapHudNavigationControl, {
  showCompass: false,
});

const AppScaleControl = withProps(MapHudScaleControl, {
  maxWidth: 100,
  unit: 'metric',
});

const AppAttributionControl = withProps(MapHudAttributionControl, {
  customAttribution:
    'Background map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, style &copy; <a href="https://carto.com/attributions">CARTO</a>. Satellite imagery: <a href="https://s2maps.eu">Sentinel-2 cloudless - https://s2maps.eu</a> by <a href="https://eox.at">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020)',
  compact: true,
});

const MapHudDesktopLayout = () => {
  return (
    <MapHud left={globalStyleVariables.controlSidebarWidth}>
      <MapHudRegion position="top-left" StackProps={{ spacing: 1 }}>
        <AppPlaceSearch />
        <MapLayerSelection />
      </MapHudRegion>
      <MapHudRegion position="top-right">
        <AppNavigationControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-right" style={{ maxWidth: '40%' }}>
        <AppScaleControl />
        <AppAttributionControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-left">
        <MapLegend />
      </MapHudRegion>
    </MapHud>
  );
};

const MapHudMobileLayout = () => {
  return (
    <MapHud bottom={120}>
      <MapHudRegion position="top-left" StackProps={{ spacing: 1 }}>
        <AppPlaceSearch />
        <MapLayerSelection />
      </MapHudRegion>
      <MapHudRegion position="top-right">
        <AppNavigationControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-right">
        <AppScaleControl />
        <AppAttributionControl />
      </MapHudRegion>
    </MapHud>
  );
};

const MapViewContent = () => {
  const [viewState, setViewState] = useRecoilState(mapViewStateState);
  useSyncMapUrl();

  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const { mapStyle, firstLabelId } = useBasemapStyle(background, showLabels);

  const viewLayers = useRecoilValue(viewLayersFlatState);
  const saveViewLayers = useSaveViewLayers();

  useEffect(() => {
    saveViewLayers(viewLayers);
  }, [saveViewLayers, viewLayers]);

  const viewLayersParams = useRecoilValue(viewLayersParamsState);

  const interactionGroups = useRecoilValue(interactionGroupsState);

  const fitBounds = useRecoilValue(mapFitBoundsState);

  const resetFitBounds = useResetRecoilState(mapFitBoundsState);
  useEffect(() => {
    // reset map fit bounds whenever MapView is mounted
    resetFitBounds();
  }, [resetFitBounds]);

  const isMobile = useIsMobile();

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
      {isMobile ? <MapHudMobileLayout /> : <MapHudDesktopLayout />}
    </BaseMap>
  );
};

export const MapView = () => (
  <ErrorBoundary message="There was a problem displaying the map." justifyErrorContent="center">
    <Suspense fallback={null}>
      <MapViewContent />
    </Suspense>
  </ErrorBoundary>
);
