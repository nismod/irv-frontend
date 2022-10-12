export const HAZARDS_METADATA = {
  cyclone: {
    label: 'Cyclones',
    dataUnit: 'm/s',
  },
  fluvial: {
    label: 'River Flooding',
    dataUnit: 'm',
  },
  surface: {
    label: 'Surface Flooding',
    dataUnit: 'm',
  },
  coastal: {
    label: 'Coastal Flooding',
    dataUnit: 'm',
  },
  extreme_heat_occurrence: {
    label: 'Extreme Heat (Occurrence)',
    dataUnit: 'deg',
  },
  extreme_heat_exposure: {
    label: 'Extreme Heat (Exposure)',
    dataUnit: 'deg',
  },
};

export const HAZARDS_MAP_ORDER = ['cyclone', 'fluvial', 'surface', 'coastal', 'extreme_heat_occurrence', 'extreme_heat_exposure'];
export const HAZARDS_UI_ORDER = ['fluvial', 'surface', 'coastal', 'cyclone', 'extreme_heat_occurrence', 'extreme_heat_exposure'];
