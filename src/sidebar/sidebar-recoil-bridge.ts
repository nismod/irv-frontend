import { atomFamily } from 'recoil';

/**
 * Recoil passthrough for unmigrated layer selectors (Slice 15b).
 * Fed from Jotai by `SidebarPathVisibilityRecoilBridge`.
 */
export const sidebarPathVisibilityState = atomFamily<boolean, string>({
  key: 'sidebarPathVisibilityState',
  default: false,
});

/** Sidebar paths read by Recoil layer selectors that are not yet on Jotai. */
export const SIDEBAR_PATHS_FOR_RECOIL_LAYERS = [
  'exposure/buildings',
  'exposure/topography',
  'exposure/industry',
  'vulnerability/human/travel-time',
  'vulnerability/human/human-development',
  'vulnerability/nature/protected-areas',
  'hazards/cdd',
] as const;
