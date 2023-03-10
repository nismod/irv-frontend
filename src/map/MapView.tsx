import { Suspense, useCallback, useEffect } from 'react';
import { AttributionControl, NavigationControl, ScaleControl, StaticMap } from 'react-map-gl';
import { atom, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';

import { BoundingBox } from '@/lib/bounding-box';
import { DataMap } from '@/lib/data-map/DataMap';
import { DataMapTooltip } from '@/lib/data-map/DataMapTooltip';
import { MapBoundsFitter } from '@/lib/map/MapBoundsFitter';
import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';
import { MapSearch } from '@/lib/map/place-search/MapSearch';
import { PlaceSearchResult } from '@/lib/map/place-search/use-place-search';
import { ErrorBoundary } from '@/lib/react/ErrorBoundary';
import { withProps } from '@/lib/react/with-props';

import { mapViewConfig } from '@/config/map-view';
import { interactionGroupsState } from '@/state/layers/interaction-groups';
import { viewLayersFlatState } from '@/state/layers/view-layers-flat';
import { useSaveViewLayers, viewLayersParamsState } from '@/state/layers/view-layers-params';
import { globalStyleVariables } from '@/theme';
import { useIsMobile } from '@/use-is-mobile';

import { MapLayerSelection } from './layers/MapLayerSelection';
import { backgroundState } from './layers/layers-state';
import { MapLegend } from './legend/MapLegend';
import { TooltipContent } from './tooltip/TooltipContent';
import { useBackgroundConfig } from './use-background-config';

export const mapFitBoundsState = atom<BoundingBox>({
  key: 'mapFitBoundsState',
  default: null,
});

const INITIAL_VIEW_STATE = {
  ...mapViewConfig.initialViewState,
  ...mapViewConfig.viewLimits,
};

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

const AppNavigationControl = withProps(NavigationControl, {
  showCompass: false,
  capturePointerMove: true,
  style: {
    position: 'static', // override default position:absolute to play well with the layout
  },
});

const AppScaleControl = withProps(ScaleControl, {
  maxWidth: 100,
  unit: 'metric',
  style: { position: 'static' }, // override default position:absolute to play well with the layout
  capturePointerMove: true,
});

const AppAttributionControl = withProps(AttributionControl, {
  customAttribution:
    'Background map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, style &copy; <a href="https://carto.com/attributions">CARTO</a>. Satellite imagery: <a href="https://s2maps.eu">Sentinel-2 cloudless - https://s2maps.eu</a> by <a href="https://eox.at">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020)',
  compact: true,
  capturePointerMove: true,
  style: { position: 'static' }, // override default position:absolute to play well with the layout
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
  const background = useRecoilValue(backgroundState);
  const viewLayers = useRecoilValue(viewLayersFlatState);
  const saveViewLayers = useSaveViewLayers();

  useEffect(() => {
    saveViewLayers(viewLayers);
  }, [saveViewLayers, viewLayers]);

  const viewLayersParams = useRecoilValue(viewLayersParamsState);

  const interactionGroups = useRecoilValue(interactionGroupsState);

  const backgroundStyle = useBackgroundConfig(background);

  const fitBounds = useRecoilValue(mapFitBoundsState);

  const resetFitBounds = useResetRecoilState(mapFitBoundsState);
  useEffect(() => {
    // reset map fit bounds whenever MapView is mounted
    resetFitBounds();
  }, [resetFitBounds]);

  const isMobile = useIsMobile();

  return (
    <DataMap
      initialViewState={INITIAL_VIEW_STATE}
      viewLayers={viewLayers}
      viewLayersParams={viewLayersParams}
      interactionGroups={interactionGroups}
    >
      <StaticMap mapStyle={backgroundStyle} attributionControl={false} />
      <MapBoundsFitter boundingBox={fitBounds} />
      <DataMapTooltip>
        <TooltipContent />
      </DataMapTooltip>
      {isMobile ? <MapHudMobileLayout /> : <MapHudDesktopLayout />}
    </DataMap>
  );
};

export const MapView = () => (
  <ErrorBoundary message="There was a problem displaying the map." justifyErrorContent="center">
    <Suspense fallback={null}>
      <MapViewContent />
    </Suspense>
  </ErrorBoundary>
);
