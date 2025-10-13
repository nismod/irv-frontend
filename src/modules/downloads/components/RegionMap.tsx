import ZoomOutMap from '@mui/icons-material/ZoomOutMap';
import Box, { BoxProps } from '@mui/material/Box';
import { GeoJsonLayer, MapViewState } from 'deck.gl';
import { MultiPolygon, Polygon } from 'geojson';
import { Suspense, useCallback, useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { useResizeDetector } from 'react-resize-detector';

import { extendBbox, geoJsonToAppBoundingBox } from '@/lib/bounding-box';
import { DeckGLOverlay } from '@/lib/map/DeckGLOverlay';
import { MapHudAttributionControl } from '@/lib/map/hud/mapbox-controls';
import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudButton } from '@/lib/map/hud/MapHudButton';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';
import { getBoundingBoxViewState } from '@/lib/map/MapBoundsFitter';

import { useBackgroundAttribution, useBasemapStyle } from '@/map/use-basemap-style';

function compareViewStateWithInitial(viewState: any, initialViewState: any) {
  for (const key of Object.keys(initialViewState)) {
    if (viewState[key] !== initialViewState[key]) return true;
  }
  return false;
}

function useViewState(initialViewStateFn: () => MapViewState) {
  const [sanitizedInitialViewState, setSanitizedInitialViewState] = useState(initialViewStateFn);
  const [viewState, setViewState] = useState(sanitizedInitialViewState);
  const [saveSanitized, setSaveSanitized] = useState(null);

  /**
   * If the `initialViewState` needs to be normalized by DeckGL at initialization,
   * it will be changed but only the second `onViewStateChange` will contain the sanitized value
   * That's why the `saveSanitized` state changes upon viewState change as follows: null -> true -> false
   */
  const handleViewState = useCallback(
    (newViewState: MapViewState) => {
      if (saveSanitized == null) {
        setSaveSanitized(true);
      } else if (saveSanitized === true) {
        setSanitizedInitialViewState(newViewState);
        setSaveSanitized(false);
      }

      setViewState(newViewState);
    },
    [saveSanitized],
  );

  return {
    viewState,
    setViewState: handleViewState,
    initialViewState: sanitizedInitialViewState,
  };
}

export function RegionMap({
  regionGeometry,
  regionEnvelope,
  width: responsiveWidth,
  height: responsiveHeight,
}: {
  regionGeometry: MultiPolygon;
  regionEnvelope: Polygon;
  width: BoxProps['width'];
  height: BoxProps['height'];
}) {
  const { width, height, ref: containerRef } = useResizeDetector();

  return (
    <Box ref={containerRef} height={responsiveHeight} width={responsiveWidth} position="relative">
      {width != null && (
        <Suspense fallback={null}>
          <RegionMapImpl
            regionGeometry={regionGeometry}
            regionEnvelope={regionEnvelope}
            width={width}
            height={height}
          />
        </Suspense>
      )}
    </Box>
  );
}

function RegionMapImpl({
  regionGeometry,
  regionEnvelope,
  width,
  height,
}: {
  regionGeometry: MultiPolygon;
  regionEnvelope: Polygon;
  width: number;
  height: number;
}) {
  const { viewState, setViewState, initialViewState } = useViewState(() => {
    const boundingBox = geoJsonToAppBoundingBox(regionEnvelope);
    const enlarged = extendBbox(boundingBox, 100);

    return getBoundingBoxViewState(enlarged, width, height);
  });

  const viewStateChanged =
    viewState == null || initialViewState == null
      ? false
      : compareViewStateWithInitial(viewState, initialViewState);

  const { mapStyle } = useBasemapStyle('satellite', false);
  const backgroundAttrib = useBackgroundAttribution('satellite');

  return (
    <Map
      {...viewState}
      onMove={({ viewState }) => setViewState(viewState)}
      mapStyle={mapStyle}
      attributionControl={false}
    >
      <DeckGLOverlay
        layers={[
          new GeoJsonLayer({
            data: regionGeometry,
            stroked: true,
            getLineColor: [150, 150, 255],
            getLineWidth: 3,
            lineWidthUnits: 'pixels',
            filled: true,
            getFillColor: [150, 150, 255, 100],
          }),
        ]}
      />
      <MapHud>
        <MapHudRegion position="top-right">
          <MapHudButton
            disabled={!viewStateChanged}
            title="Reset view"
            onClick={() => setViewState({ ...viewState, ...initialViewState })}
          >
            <ZoomOutMap />
          </MapHudButton>
        </MapHudRegion>
        <MapHudRegion position="bottom-right">
          <MapHudAttributionControl customAttribution={backgroundAttrib} compact={true} />
        </MapHudRegion>
      </MapHud>
    </Map>
  );
}
