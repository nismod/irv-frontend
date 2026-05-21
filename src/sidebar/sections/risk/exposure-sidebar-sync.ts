import _ from 'lodash';
import type { TransactionInterface_UNSTABLE } from 'recoil';

import { sidebarPathChildrenState, sidebarVisibilityToggleState } from '@/sidebar/SidebarContent';

/**
 * When a Risk sub-section is active, enable only the matching exposure sidebar leaf.
 * Writes leaf `sidebarVisibilityToggleState` atoms (not the hierarchical selector).
 */
export function syncExposure({ get, set }: TransactionInterface_UNSTABLE, layer: string) {
  const hazardSubPaths = get(sidebarPathChildrenState('exposure'));

  set(sidebarVisibilityToggleState('exposure'), true);
  _.forEach(hazardSubPaths, (subPath) => {
    set(sidebarVisibilityToggleState(`exposure/${subPath}`), subPath === layer);
  });
}

export function hideExposure({ set }: TransactionInterface_UNSTABLE, layer: string) {
  set(sidebarVisibilityToggleState(`exposure/${layer}`), false);
}
