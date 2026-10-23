import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

import 'maplibre-gl/dist/maplibre-gl.css';

// Configure the shared worker before any map mounts, including standalone embeds.
setWorkerUrl(workerUrl);

export { Map } from 'react-map-gl/maplibre';
