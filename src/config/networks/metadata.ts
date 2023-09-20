import { makeConfig } from '@/lib/helpers';

import { INFRASTRUCTURE_COLORS } from '@/config/networks/colors';

import { AssetMetadata } from '../assets/metadata';

export const NETWORK_LAYERS = [
  'power_transmission',
  'power_distribution',
  'rail_edges',
  'rail_nodes',
  'road_edges_motorway',
  'road_edges_trunk',
  'road_edges_primary',
  'road_edges_secondary',
  'road_edges_tertiary',
] as const;

export type NetworkLayerType = (typeof NETWORK_LAYERS)[number];

export const NETWORKS_METADATA = makeConfig<AssetMetadata, NetworkLayerType>([
  {
    id: 'power_transmission',
    type: 'line',
    label: 'Power Transmission (OSM)',
    color: INFRASTRUCTURE_COLORS.electricity_high.css,
  },
  {
    id: 'power_distribution',
    type: 'line',
    label: 'Power Distribution (Gridfinder)',
    color: INFRASTRUCTURE_COLORS.electricity_low.css,
  },
  {
    id: 'rail_edges',
    type: 'line',
    label: 'Railways',
    color: INFRASTRUCTURE_COLORS.railway.css,
  },
  {
    id: 'rail_nodes',
    type: 'circle',
    label: 'Railway Stations',
    color: INFRASTRUCTURE_COLORS.railway.css,
  },
  {
    id: 'road_edges_motorway',
    type: 'line',
    label: 'Roads (Motorway)',
    color: INFRASTRUCTURE_COLORS.roads_motorway.css,
  },
  {
    id: 'road_edges_trunk',
    type: 'line',
    label: 'Roads (Trunk)',
    color: INFRASTRUCTURE_COLORS.roads_trunk.css,
  },
  {
    id: 'road_edges_primary',
    type: 'line',
    label: 'Roads (Primary)',
    color: INFRASTRUCTURE_COLORS.roads_primary.css,
  },
  {
    id: 'road_edges_secondary',
    type: 'line',
    label: 'Roads (Secondary)',
    color: INFRASTRUCTURE_COLORS.roads_secondary.css,
  },
  {
    id: 'road_edges_tertiary',
    type: 'line',
    label: 'Roads (Tertiary)',
    color: INFRASTRUCTURE_COLORS.roads_unknown.css,
  },
]);
