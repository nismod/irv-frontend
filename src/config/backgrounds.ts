import { makeConfig } from '@/lib/helpers';

export const BACKGROUNDS = makeConfig([
  {
    id: 'light',
    label: 'Map',
    source: {
      id: 'light',
      type: 'raster',
      tiles: [
        'https://tiles.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        'https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        'https://d.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
    },
    layer: {
      id: 'bg-light',
      source: 'light',
      type: 'raster',
    },
  },
  {
    id: 'satellite',
    label: 'Satellite',
    source: {
      id: 'satellite',
      type: 'raster',
      tiles: [
        'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.png',
      ],
      tileSize: 256,
    },
    layer: {
      id: 'bg-satellite',
      source: 'satellite',
      type: 'raster',
    },
  },
]);

export const BACKGROUND_ATTRIBUTIONS: Record<keyof typeof BACKGROUNDS, string> = {
  light:
    'Background map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, style &copy; <a href="https://carto.com/attributions">CARTO</a>',
  satellite:
    'Satellite imagery: <a href="https://s2maps.eu">Sentinel-2 cloudless - https://s2maps.eu</a> by <a href="https://eox.at">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020)',
};

export type BackgroundName = keyof typeof BACKGROUNDS;
