import type { StoreOps } from '@/lib/jotai/effects/store-ops';
import { collectAllPathsUnder, getParentPath } from '@/lib/paths/utils';

import { sidebarPathChildrenAtomFamily, sidebarVisibilityToggleAtomFamily } from './sidebar-state';

/** Hide every path under `root`, then show `visiblePath` and its ancestors. */
export function setOnlyVisiblePathUnder({ get, set }: StoreOps, root: string, visiblePath: string) {
  for (const path of collectAllPathsUnder(root, (p) => get(sidebarPathChildrenAtomFamily(p)))) {
    set(sidebarVisibilityToggleAtomFamily(path), false);
  }

  let path = visiblePath;
  while (path !== '') {
    set(sidebarVisibilityToggleAtomFamily(path), true);
    path = getParentPath(path);
  }
}
