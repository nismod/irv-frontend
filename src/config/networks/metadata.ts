import { makeConfig } from '@/lib/helpers';

import { INFRASTRUCTURE_COLORS } from '@/config/networks/colors';
import type { RdlsDataset } from '@/details/pixel-driller/download/metadata-types';

import { AssetMetadata } from '../assets/metadata';
import { GLOBAL_SPATIAL, SOURCE_DATASET_LINEAGE_DESCRIPTION } from '../layer-metadata-helpers';

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

export const NETWORK_LAYER_METADATA = [
  {
    id: 'osm-roads-rail',
    title: 'Roads and Rail',
    description:
      'Extract from OpenStreetMap October 2021. All roads tagged as trunk, motorway, primary, secondary or tertiary, all rail lines tagged as rail and railway stations.',
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'OpenStreetMap contributors' },
    contact_point: { name: 'OpenStreetMap contributors' },
    creator: { name: 'OpenStreetMap contributors' },
    license: 'https://opendatacommons.org/licenses/odbl/1-0/',
    resources: [
      {
        id: 'source_osm_roads_rail',
        title: 'OpenStreetMap',
        description: '',
        access_url: 'https://planet.openstreetmap.org/',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_osm_roads_rail_citation_1',
          name: 'OpenStreetMap contributors https://www.openstreetmap.org/copyright.',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'https://opendatacommons.org/licenses/odbl/1-0/',
        },
      ],
    },
  },
  {
    id: 'gridfinder-power-transmission',
    title: 'Gridfinder Power Transmission lines',
    description:
      "Predicted distribution and transmission line network, with existing OpenStreetMap lines tagged in the 'source' column and OpenStreetMap contributors.",
    risk_data_type: ['exposure'],
    spatial: GLOBAL_SPATIAL,
    publisher: { name: 'Gridfinder' },
    contact_point: { name: 'C. Arderne' },
    creator: { name: 'C. Arderne' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    resources: [
      {
        id: 'source_gridfinder_power_transmission',
        title: 'Gridfinder Power Transmission lines',
        description: '',
        access_url: 'https://doi.org/10.5281/zenodo.3628142',
      },
    ],
    lineage: {
      description: SOURCE_DATASET_LINEAGE_DESCRIPTION,
      sources: [
        {
          id: 'source_gridfinder_power_transmission_citation_1',
          name: 'Arderne, C., Zorn, C., Nicolas, C. et al. Predictive mapping of the global power system using open data. Sci Data 7, 19 (2020). https://doi.org/10.1038/s41597-019-0347-4.',
          type: 'dataset',
          risk_data_type: 'exposure',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
      ],
    },
  },
] as const satisfies readonly RdlsDataset[];
