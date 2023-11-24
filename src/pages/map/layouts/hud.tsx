import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import {
  MapHudAttributionControl,
  MapHudNavigationControl,
  MapHudScaleControl,
} from '@/lib/map/hud/mapbox-controls';
import { MapSearch } from '@/lib/map/place-search/MapSearch';
import { PlaceSearchResult } from '@/lib/map/place-search/use-place-search';
import { withProps } from '@/lib/react/with-props';

import { mapFitBoundsState } from '@/map/MapView';

export const AppPlaceSearch = () => {
  const setFitBounds = useSetRecoilState(mapFitBoundsState);

  const handleSelectedSearchResult = useCallback(
    (result: PlaceSearchResult) => {
      setFitBounds(result.boundingBox);
    },
    [setFitBounds],
  );

  return <MapSearch onSelectedResult={handleSelectedSearchResult} />;
};

export const AppNavigationControl = withProps(MapHudNavigationControl, {
  showCompass: false,
});

export const AppScaleControl = withProps(MapHudScaleControl, {
  maxWidth: 100,
  unit: 'metric',
});

export const AppAttributionControl = withProps(MapHudAttributionControl, {
  customAttribution:
    'Background map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, style &copy; <a href="https://carto.com/attributions">CARTO</a>. Satellite imagery: <a href="https://s2maps.eu">Sentinel-2 cloudless - https://s2maps.eu</a> by <a href="https://eox.at">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020)',
  compact: true,
});
