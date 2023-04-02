import { number } from '@recoiljs/refine';
import { useEffect } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

import { useThrottledCallback } from '@/lib/hooks/use-throttled-callback';

import { mapViewConfig } from '@/config/map-view';

export const mapZoomUrlState = atom({
  key: 'mapZoomUrl',
  default: mapViewConfig.initialViewState.zoom,
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'z',
      refine: number(),
      syncDefault: true,
    }),
  ],
});

export const mapLonUrlState = atom({
  key: 'mapLonUrl',
  default: mapViewConfig.initialViewState.longitude,
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'x',
      refine: number(),
      syncDefault: true,
    }),
  ],
});

export const mapLatUrlState = atom({
  key: 'mapLatUrl',
  default: mapViewConfig.initialViewState.latitude,
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'y',
      refine: number(),
      syncDefault: true,
    }),
  ],
});

export function useSyncMapUrlAtom(coordState, coordUrlState, ms) {
  const coord = useRecoilValue(coordState);
  const setUrlCoord = useSetRecoilState(coordUrlState);

  const setUrlThrottled = useThrottledCallback(setUrlCoord, ms);

  useEffect(() => {
    setUrlThrottled(coord);
  }, [coord, setUrlThrottled]);
}
