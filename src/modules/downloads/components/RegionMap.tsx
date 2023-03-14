import { ZoomOutMap } from '@mui/icons-material';
import { Box } from '@mui/material';
import { DeckGL, GeoJsonLayer, MapViewState } from 'deck.gl/typed';
import { Geometry } from 'geojson';
import { useCallback, useState } from 'react';
import { MapContext, StaticMap } from 'react-map-gl';

import { extendBbox, geoJsonToAppBoundingBox } from '@/lib/bounding-box';
import { getBoundingBoxViewState } from '@/lib/map/MapBoundsFitter';
import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudButton } from '@/lib/map/hud/MapHudButton';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';
import { MapHudAttributionControl } from '@/lib/map/hud/mapbox-controls';

import { useBackgroundAttribution, useBackgroundConfig } from '@/map/use-background-config';

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
  width,
  height,
}: {
  regionGeometry: Geometry;
  regionEnvelope: Geometry;
  width: number;
  height: number;
}) {
  const boundingBox = geoJsonToAppBoundingBox(regionEnvelope);
  const enlarged = extendBbox(boundingBox, 100);
  const { viewState, setViewState, initialViewState } = useViewState(() =>
    getBoundingBoxViewState(enlarged, width, height),
  );
  const viewStateChanged =
    viewState == null || initialViewState == null
      ? false
      : compareViewStateWithInitial(viewState, initialViewState);

  const backgroundStyle = useBackgroundConfig('satellite');
  const backgroundAttrib = useBackgroundAttribution('satellite');

  return (
    <Box height={height} width={width} position="relative">
      <DeckGL
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as MapViewState)}
        controller={true}
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
        ContextProvider={MapContext.Provider as any}
      >
        <StaticMap mapStyle={backgroundStyle} />
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
            <MapHudAttributionControl customAttribution={backgroundAttrib} />
          </MapHudRegion>
        </MapHud>
      </DeckGL>
    </Box>
  );
}
