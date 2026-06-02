import { useAtomCallback } from 'jotai/utils';
import { useCallback, useLayoutEffect } from 'react';

import { StateSyncRoot } from '@/lib/jotai/state-sync/StateSyncRoot';
import { usePathChildrenLoading } from '@/lib/paths/context';

import { hydratePreferencesFromUrlTree } from './sidebar-sections-url';
import {
  sidebarSectionsUrlAtom,
  sidebarSectionsUrlOutwardAtom,
  sidebarVisibilityToggleAtomFamily,
} from './sidebar-state';

/**
 * Hydrates per-path preferences from the URL once on mount, then keeps the URL in sync
 * with the outward projection of visible preferences (mirrors old SidebarUrlStateSyncRoot).
 */
export function SidebarSectionsUrlSync() {
  const sidebarRootLoading = usePathChildrenLoading('');

  const hydrateFromUrl = useAtomCallback(
    useCallback((get, set) => {
      const tree = get(sidebarSectionsUrlAtom);
      hydratePreferencesFromUrlTree(tree, '', (path, visible) => {
        set(sidebarVisibilityToggleAtomFamily(path), visible);
      });
    }, []),
  );

  useLayoutEffect(() => {
    hydrateFromUrl();
  }, [hydrateFromUrl]);

  return (
    <StateSyncRoot
      state={sidebarSectionsUrlOutwardAtom}
      replicaState={sidebarSectionsUrlAtom}
      doSync={!sidebarRootLoading}
    />
  );
}
