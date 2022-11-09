import { TreeNode } from '@/lib/controls/checkbox-tree/tree-node';

interface NetworkLayerData {
  label: string;
}

export const NETWORK_LAYERS_HIERARCHY: TreeNode<NetworkLayerData>[] = [
  {
    id: 'power',
    label: 'Power',
    children: [
      {
        id: 'power_transmission',
        label: 'Transmission (OSM)',
      },
      {
        id: 'power_distribution',
        label: 'Distribution (Gridfinder)',
      },
    ],
  },
  {
    id: 'rail-network',
    label: 'Rail',
    children: [
      {
        id: 'rail_edges',
        label: 'Railways',
      },
      // {
      //   id: 'rail_stations',
      //   label: 'Stations',
      // },
      {
        id: 'rail_nodes',
        label: 'Stations',
      },
    ],
  },
  {
    id: 'road-network',
    label: 'Roads',
    children: [
      {
        id: 'road_edges_motorway',
        label: 'Motorway',
      },
      {
        id: 'road_edges_trunk',
        label: 'Trunk',
      },
      {
        id: 'road_edges_primary',
        label: 'Primary',
      },
      {
        id: 'road_edges_secondary',
        label: 'Secondary',
      },
      {
        id: 'road_edges_tertiary',
        label: 'Tertiary',
      },
    ],
  },
  // {
  //   id: 'transport',
  //   label: 'Transport',
  //   children: [

  // {
  //   id: 'port_areas',
  //   label: 'Ports',
  //   children: [
  //     {
  //       id: 'port_areas_break',
  //       label: 'Break',
  //     },
  //     {
  //       id: 'port_areas_container',
  //       label: 'Container',
  //     },
  //     {
  //       id: 'port_areas_industry',
  //       label: 'Industry',
  //     },
  //     {
  //       id: 'port_areas_silo',
  //       label: 'Silo',
  //     },
  //   ],
  // },
  // {
  //   id: 'air',
  //   label: 'Airports',
  //   children: [
  //     {
  //       id: 'airport_runways',
  //       label: 'Runways',
  //     },
  //     {
  //       id: 'airport_terminals',
  //       label: 'Terminals',
  //     },
  //   ],
  // },
  // ],
  // },
  // {
  //   id: 'water',
  //   label: 'Water',
  //   children: [
  //     {
  //       id: 'water-supply',
  //       label: 'Potable Water Supply',
  //       children: [
  //         {
  //           id: 'water_potable_edges',
  //           label: 'Supply Pipelines',
  //         },
  //         {
  //           id: 'water_potable_nodes',
  //           label: 'Supply Facilities',
  //           children: [
  //             {
  //               id: 'water_potable_nodes_booster',
  //               label: 'Booster Station',
  //             },
  //             {
  //               id: 'water_potable_nodes_catchment',
  //               label: 'Catchment',
  //             },
  //             {
  //               id: 'water_potable_nodes_entombment',
  //               label: 'Entombment',
  //             },
  //             {
  //               id: 'water_potable_nodes_filter',
  //               label: 'Filter Plant',
  //             },
  //             {
  //               id: 'water_potable_nodes_intake',
  //               label: 'Intake',
  //             },
  //             {
  //               id: 'water_potable_nodes_well',
  //               label: 'Production Well',
  //             },
  //             {
  //               id: 'water_potable_nodes_pump',
  //               label: 'Pump Station',
  //             },
  //             {
  //               id: 'water_potable_nodes_relift',
  //               label: 'Relift Station',
  //             },
  //             {
  //               id: 'water_potable_nodes_reservoir',
  //               label: 'Reservoir',
  //             },
  //             {
  //               id: 'water_potable_nodes_river_source',
  //               label: 'River Source',
  //             },
  //             {
  //               id: 'water_potable_nodes_spring',
  //               label: 'Spring',
  //             },
  //             {
  //               id: 'water_potable_nodes_tank',
  //               label: 'Storage Tank',
  //             },
  //             {
  //               id: 'water_potable_nodes_sump',
  //               label: 'Sump',
  //             },
  //             {
  //               id: 'water_potable_nodes_tp',
  //               label: 'Treatment Plant',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       id: 'water-irrigation',
  //       label: 'Irrigation',
  //       children: [
  //         {
  //           id: 'water_irrigation_edges',
  //           label: 'Irrigation Canals',
  //         },
  //         {
  //           id: 'water_irrigation_nodes',
  //           label: 'Irrigation Wells',
  //         },
  //       ],
  //     },
  //     {
  //       id: 'water-waste',
  //       label: 'Wastewater',
  //       children: [
  //         {
  //           id: 'water_waste_edges',
  //           label: 'Wastewater Pipelines',
  //           children: [
  //             {
  //               id: 'water_waste_sewer_gravity',
  //               label: 'Gravity',
  //             },
  //             {
  //               id: 'water_waste_sewer_pressure',
  //               label: 'Pressure',
  //             },
  //           ],
  //         },
  //         {
  //           id: 'water_waste_nodes',
  //           label: 'Wastewater Facilities',
  //           children: [
  //             {
  //               id: 'water_waste_nodes_sump',
  //               label: 'Sump',
  //             },
  //             {
  //               id: 'water_waste_nodes_pump',
  //               label: 'Pump',
  //             },
  //             {
  //               id: 'water_waste_nodes_relift',
  //               label: 'Relift Station',
  //             },
  //             {
  //               id: 'water_waste_nodes_wwtp',
  //               label: 'Treatment Plant',
  //             },
  //           ],
  //         },
  // ],
  // },
  // ],
  // },
];
