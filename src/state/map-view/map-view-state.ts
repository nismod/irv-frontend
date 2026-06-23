import type { MapViewState } from 'deck.gl';
import { atom } from 'jotai';
import { atomWithDefault, atomWithReset, RESET } from 'jotai/utils';
import _ from 'lodash';

import { BoundingBox } from '@/lib/bounding-box';
import { useSyncStateThrottled } from '@/lib/jotai/state-sync/use-sync-state-throttled';

import { mapViewConfig } from '@/config/map-view';

import { mapLatUrlAtom, mapLonUrlAtom, mapZoomUrlAtom } from './map-url';

const mapLatAtom = atomWithDefault((get) => get(mapLatUrlAtom));
const mapLonAtom = atomWithDefault((get) => get(mapLonUrlAtom));
const mapZoomAtom = atomWithDefault((get) => get(mapZoomUrlAtom));

const INITIAL_VIEW_STATE = {
  ...mapViewConfig.initialViewState,
  ...mapViewConfig.viewLimits,
};

const INITIAL_NON_COORDS_STATE = _.omit(INITIAL_VIEW_STATE, ['latitude', 'longitude', 'zoom']);

const nonCoordsMapViewStateAtom = atomWithReset({ ...INITIAL_NON_COORDS_STATE });

const INITIAL_MAP_FIT_BOUNDS: BoundingBox = null;
export const mapFitBoundsAtom = atomWithReset(INITIAL_MAP_FIT_BOUNDS);

export const mapViewStateAtom = atom<MapViewState, [MapViewState | typeof RESET], void>(
  (get) => ({
    ...get(nonCoordsMapViewStateAtom),
    latitude: get(mapLatAtom),
    longitude: get(mapLonAtom),
    zoom: get(mapZoomAtom),
  }),
  (_get, set, newValue) => {
    if (newValue === RESET) {
      set(mapZoomAtom, RESET);
      set(mapLonAtom, RESET);
      set(mapLatAtom, RESET);
      set(nonCoordsMapViewStateAtom, RESET);
      return;
    }

    const { latitude, longitude, zoom, ...nonCoords } = newValue;
    set(mapZoomAtom, zoom);
    set(mapLonAtom, longitude);
    set(mapLatAtom, latitude);
    set(nonCoordsMapViewStateAtom, nonCoords);
  },
);

export function useSyncMapUrl() {
  useSyncStateThrottled(mapLatAtom, mapLatUrlAtom, 2000);
  useSyncStateThrottled(mapLonAtom, mapLonUrlAtom, 2000);
  useSyncStateThrottled(mapZoomAtom, mapZoomUrlAtom, 2000);
}
