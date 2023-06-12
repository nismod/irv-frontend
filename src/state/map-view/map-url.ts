import { number } from '@recoiljs/refine';
import { DefaultValue, atom } from 'recoil';
import { WriteAtom, urlSyncEffect } from 'recoil-sync';

import { mapViewConfig } from '@/config/map-view';

/**
 * Makes a recoil-sync write function that saves a number with up to `maximumFractionDigits`
 */
function makeWriteNumber(itemKey: string, maximumFractionDigits: number) {
  const writeNumber: WriteAtom<number> = ({ write, reset }, x) => {
    if (x instanceof DefaultValue) {
      reset(itemKey);
    } else {
      write(
        itemKey,
        +x.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits,
          useGrouping: false,
        }),
      );
    }
  };

  return writeNumber;
}

export const mapZoomUrlState = atom({
  key: 'mapZoomUrl',
  default: mapViewConfig.initialViewState.zoom,
  effects: [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: 'z',
      refine: number(),
      write: makeWriteNumber('z', 2),
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
      write: makeWriteNumber('x', 5),
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
      write: makeWriteNumber('y', 5),
      syncDefault: true,
    }),
  ],
});
