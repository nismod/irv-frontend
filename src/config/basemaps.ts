import { makeConfig } from '@/lib/helpers';

export interface BackgroundSpecification {
  id: string;
  label: string;
  layers: string[];
}

export const BASEMAP_STYLE_URL = '/map-styles/map-style.json';

export const BACKGROUNDS = makeConfig([
  {
    id: 'light',
    label: 'Map',
    layers: [
      'background',
      'landcover',
      'park_national_park',
      'park_nature_reserve',
      'landuse_residential',
      'landuse',
      'waterway',
      'boundary_county',
      'boundary_state',
      'water',
      'water_shadow',
      'aeroway-runway',
      'aeroway-taxiway',
      'waterway_label',
      'tunnel_service_case',
      'tunnel_minor_case',
      'tunnel_sec_case',
      'tunnel_pri_case',
      'tunnel_trunk_case',
      'tunnel_mot_case',
      'tunnel_path',
      'tunnel_service_fill',
      'tunnel_minor_fill',
      'tunnel_sec_fill',
      'tunnel_pri_fill',
      'tunnel_trunk_fill',
      'tunnel_mot_fill',
      'tunnel_rail',
      'tunnel_rail_dash',
      'road_service_case',
      'road_minor_case',
      'road_pri_case_ramp',
      'road_trunk_case_ramp',
      'road_mot_case_ramp',
      'road_sec_case_noramp',
      'road_pri_case_noramp',
      'road_trunk_case_noramp',
      'road_mot_case_noramp',
      'road_path',
      'road_service_fill',
      'road_minor_fill',
      'road_pri_fill_ramp',
      'road_trunk_fill_ramp',
      'road_mot_fill_ramp',
      'road_sec_fill_noramp',
      'road_pri_fill_noramp',
      'road_trunk_fill_noramp',
      'road_mot_fill_noramp',
      'rail',
      'rail_dash',
      'bridge_service_case',
      'bridge_minor_case',
      'bridge_sec_case',
      'bridge_pri_case',
      'bridge_trunk_case',
      'bridge_mot_case',
      'bridge_path',
      'bridge_service_fill',
      'bridge_minor_fill',
      'bridge_sec_fill',
      'bridge_pri_fill',
      'bridge_trunk_fill',
      'bridge_mot_fill',
      'building',
      'building-top',
      'boundary_country_outline',
      'boundary_country_inner',
    ],
  },
  {
    id: 'satellite',
    label: 'Satellite',
    layers: ['satellite'],
  },
]);

export const BACKGROUND_ATTRIBUTIONS: Record<keyof typeof BACKGROUNDS, string> = {
  light:
    'Background map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, style &copy; <a href="https://carto.com/attributions">CARTO</a>',
  satellite:
    'Satellite imagery: <a href="https://s2maps.eu">Sentinel-2 cloudless - https://s2maps.eu</a> by <a href="https://eox.at">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020)',
};

export type BackgroundName = keyof typeof BACKGROUNDS;

export const LABELS_LAYERS = [
  'watername_ocean',
  'watername_sea',
  'watername_lake',
  'watername_lake_line',
  'place_hamlet',
  'place_suburbs',
  'place_villages',
  'place_town',
  'place_country_2',
  'place_country_1',
  'place_state',
  'place_continent',
  'place_city_r6',
  'place_city_r5',
  'place_city_dot_r7',
  'place_city_dot_r4',
  'place_city_dot_r2',
  'place_city_dot_z7',
  'place_capital_dot_z7',
  'poi_stadium',
  'poi_park',
  'roadname_minor',
  'roadname_sec',
  'roadname_pri',
  'roadname_major',
  'housenumber',
];
