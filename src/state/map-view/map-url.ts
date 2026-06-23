import { atomWithUrlSync, makeUrlNumberCodec } from '@/lib/jotai/sync-stores/atom-with-url-sync';

import { mapViewConfig } from '@/config/map-view';

const zoomCodec = makeUrlNumberCodec(2);
const coordCodec = makeUrlNumberCodec(5);

export const mapZoomUrlAtom = atomWithUrlSync('z', {
  defaultValue: mapViewConfig.initialViewState.zoom,
  syncDefault: true,
  serialize: zoomCodec.serialize,
  deserialize: zoomCodec.deserialize,
});

export const mapLonUrlAtom = atomWithUrlSync('x', {
  defaultValue: mapViewConfig.initialViewState.longitude,
  syncDefault: true,
  serialize: coordCodec.serialize,
  deserialize: coordCodec.deserialize,
});

export const mapLatUrlAtom = atomWithUrlSync('y', {
  defaultValue: mapViewConfig.initialViewState.latitude,
  syncDefault: true,
  serialize: coordCodec.serialize,
  deserialize: coordCodec.deserialize,
});
