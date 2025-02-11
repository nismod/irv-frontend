import type { Color } from '@deck.gl/core';
import { ZoomOutMap } from '@mui/icons-material';
import { Box, BoxProps } from '@mui/material';
import { color as d3color } from 'd3-color';
import { scaleSequential as d3scaleSequential } from 'd3-scale';
import { interpolateRdYlGn as d3interpolateRdYlGn } from 'd3-scale-chromatic';
import { GeoJsonLayer, MapViewState } from 'deck.gl/typed';
import type { Feature } from 'geojson';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { useResizeDetector } from 'react-resize-detector';

import { extendBbox, geoJsonToAppBoundingBox } from '@/lib/bounding-box';
import { DeckGLOverlay } from '@/lib/map/DeckGLOverlay';
import { MapHud } from '@/lib/map/hud/MapHud';
import { MapHudButton } from '@/lib/map/hud/MapHudButton';
import { MapHudRegion } from '@/lib/map/hud/MapHudRegion';
import { getBoundingBoxViewState } from '@/lib/map/MapBoundsFitter';

import { useBasemapStyle } from '@/map/use-basemap-style';
import { AnnualGdlRecord } from '@/modules/metrics/types/AnnualGdlData';
import { DatasetExtentList } from '@/modules/metrics/types/DatasetExtent';
import { NationalGeo } from '@/modules/metrics/types/NationalGeo';
import { RegionGeo } from '@/modules/metrics/types/RegionGeo';

import { MapLabel } from './MapLabel';
import { MapLegend } from './MapLegend';

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
    setInitialViewState: setSanitizedInitialViewState,
  };
}

export default function RegionMap({
  width: responsiveWidth,
  height: responsiveHeight,
  selectedCountryData,
  highlightRegion,
  setHighlightRegion,
  selectedYear,
  domainY,
  geojson,
  nationalGeo,
  label,
}: {
  width: BoxProps['width'];
  height: BoxProps['height'];
  selectedCountryData: AnnualGdlRecord[];
  highlightRegion: string;
  setHighlightRegion: (regionId: string) => void;
  selectedYear: number;
  domainY: DatasetExtentList;
  geojson: RegionGeo[];
  nationalGeo: NationalGeo;
  label: string;
}) {
  const { width, height, ref: containerRef } = useResizeDetector();

  return (
    <Box
      ref={containerRef}
      height={responsiveHeight}
      width={responsiveWidth}
      position="relative"
      sx={{ backgroundColor: 'white' }}
    >
      {width != null && (
        <Suspense fallback={'Loading map...'}>
          <RegionMapViewer
            width={width}
            height={height}
            selectedCountryData={selectedCountryData}
            highlightRegion={highlightRegion}
            setHighlightRegion={setHighlightRegion}
            selectedYear={selectedYear}
            domainY={domainY}
            geojson={geojson}
            nationalGeo={nationalGeo}
            label={label}
          />
        </Suspense>
      )}
    </Box>
  );
}

function RegionMapViewer({
  width,
  height,
  selectedCountryData,
  highlightRegion,
  setHighlightRegion,
  selectedYear,
  domainY,
  geojson,
  nationalGeo,
  label,
}) {
  const filteredGeoJson = geojson;
  const regionEnvelope = nationalGeo.envelope;

  const calculateBoundedState = useCallback(() => {
    const boundingBox = geoJsonToAppBoundingBox(regionEnvelope);
    const enlarged = extendBbox(boundingBox, 10);

    return getBoundingBoxViewState(enlarged, width, height);
  }, [regionEnvelope, width, height]);

  const { viewState, setViewState, initialViewState, setInitialViewState } = useViewState(() => {
    return calculateBoundedState();
  });

  // If the region changes, update the view state
  useEffect(() => {
    const boundingBoxViewState = calculateBoundedState();
    setViewState(boundingBoxViewState);
    setInitialViewState(boundingBoxViewState);
  }, [calculateBoundedState, regionEnvelope, setInitialViewState, setViewState]);

  const viewStateChanged =
    viewState == null || initialViewState == null
      ? false
      : compareViewStateWithInitial(viewState, initialViewState);

  const backgroundKey = 'light';
  const { mapStyle } = useBasemapStyle(backgroundKey, true);

  const colorScale = useMemo(
    () => d3scaleSequential().domain(domainY).interpolator(d3interpolateRdYlGn),
    [domainY],
  );

  const getLineWidth = useCallback(
    (geoJsonEntry) => {
      const gdlCode = geoJsonEntry.properties.gdlCode;
      return gdlCode === highlightRegion ? 2 : 0;
    },
    [highlightRegion],
  );

  const getLineWidthNational = useCallback(
    (geoJsonEntry) => {
      return highlightRegion.endsWith('t') ? 2 : 0;
    },
    [highlightRegion],
  );

  const getColor = useCallback(
    (geoJsonEntry: Feature): Color => {
      const NOT_FOUND_COLOR = [255, 255, 255, 100];
      const gdlCode = geoJsonEntry.properties.gdlCode;

      const maybeRegionData = selectedCountryData.find(
        (d) => d.gdlCode.toLowerCase() === gdlCode && d.year === selectedYear,
      );

      if (!maybeRegionData) return NOT_FOUND_COLOR;

      const maybeRegionValue = maybeRegionData.value;

      const colorString = colorScale(maybeRegionValue);
      const colorObject = d3color(colorString).rgb();

      return [colorObject.r, colorObject.g, colorObject.b, 200];
    },
    [selectedCountryData, selectedYear, colorScale],
  );

  const highlightData = selectedCountryData.find(
    (d) => d.gdlCode.toLowerCase() === highlightRegion && highlightRegion.toLowerCase(),
  );

  return (
    <Map {...viewState} onMove={({ viewState }) => setViewState(viewState)} mapStyle={mapStyle}>
      <DeckGLOverlay
        layers={[
          new GeoJsonLayer({
            id: 'RegionsGeoJsonLayer',
            data: filteredGeoJson,
            stroked: true,
            getTooltip: () => 'test',
            getLineColor: [0, 0, 0, 255],
            getLineWidth: (d) => getLineWidth(d),
            lineWidthUnits: 'pixels',
            filled: true,
            onHover: (e) => {
              const eventObject = e.object;
              if (!eventObject || !eventObject.properties || !eventObject.properties.gdlCode) {
                setHighlightRegion(null);
              } else {
                setHighlightRegion(eventObject.properties.gdlCode);
              }
            },
            getFillColor: (d) => getColor(d),
            pickable: true,
            updateTriggers: {
              getLineWidth: [getLineWidth],
              getFillColor: [getColor],
            },
          }),
          new GeoJsonLayer({
            id: 'NationalGeo',
            data: nationalGeo.boundary,
            stroked: true,
            getLineColor: [0, 0, 0, 255],
            getLineWidth: (d) => getLineWidthNational(d),
            lineWidthUnits: 'pixels',
            filled: false,
            pickable: true,
            updateTriggers: {
              getLineWidth: [getLineWidthNational],
            },
          }),
        ]}
      />

      <MapHud>
        <MapHudRegion position="top-left">
          <MapHudButton
            disabled={!viewStateChanged}
            title="Reset view"
            onClick={() => setViewState({ ...viewState, ...initialViewState })}
          >
            <ZoomOutMap />
          </MapHudButton>
        </MapHudRegion>
      </MapHud>

      <MapLegend colorScale={colorScale} domainY={domainY} label={label} />

      <MapLabel highlightData={highlightData} selectedYear={selectedYear} />
    </Map>
  );
}
