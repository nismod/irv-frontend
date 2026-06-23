import { atom } from 'jotai';

import { INTERACTION_GROUPS } from '@/config/interaction-groups';

export const interactionGroupsAtom = atom([
  // the first group is treated as primary; its picking radius is used globally
  INTERACTION_GROUPS.assets,
  INTERACTION_GROUPS.wdpa,
  INTERACTION_GROUPS.hdi,
  INTERACTION_GROUPS.rexp,
  INTERACTION_GROUPS.hazards,
  INTERACTION_GROUPS.raster_assets,
  INTERACTION_GROUPS.scope_regions,
]);
