import type { StateEffectInterface } from '@/lib/jotai/state-effects/types';
import { collectAllPathsUnder, getParentPath } from '@/lib/paths/utils';

import { sidebarPathChildrenAtomFamily, sidebarVisibilityToggleAtomFamily } from './sidebar-state';

/** Hide every path under `root`, then show `visiblePath` and its ancestors. */
export function setOnlyVisiblePathUnder(
  { get, set }: StateEffectInterface,
  root: string,
  visiblePath: string,
) {
  for (const path of collectAllPathsUnder(root, (p) => get(sidebarPathChildrenAtomFamily(p)))) {
    set(sidebarVisibilityToggleAtomFamily(path), false);
  }

  let path = visiblePath;
  while (path !== '') {
    set(sidebarVisibilityToggleAtomFamily(path), true);
    path = getParentPath(path);
  }
}
