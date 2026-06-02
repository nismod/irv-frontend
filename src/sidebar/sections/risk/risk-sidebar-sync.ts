import type { StateEffectInterface } from '@/lib/jotai/state-effects/types';

import { setOnlyVisiblePathUnder } from '@/sidebar/sidebar-path-visibility';
import { sidebarVisibilityToggleAtomFamily } from '@/sidebar/sidebar-state';

/** When a Risk sub-section is active, enable only the matching exposure sidebar leaf. */
export function syncExposure(ops: StateEffectInterface, layer: string) {
  setOnlyVisiblePathUnder(ops, 'exposure', `exposure/${layer}`);
}

export function hideExposure({ set }: StateEffectInterface, layer: string) {
  set(sidebarVisibilityToggleAtomFamily(`exposure/${layer}`), false);
}

/** When a single hazard should be active in Risk, hide siblings under `hazards`. */
export function syncHazardSidebar(ops: StateEffectInterface, visiblePath: string) {
  setOnlyVisiblePathUnder(ops, 'hazards', visiblePath);
}
