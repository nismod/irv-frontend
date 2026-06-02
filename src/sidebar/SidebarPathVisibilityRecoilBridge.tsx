import { useAtomValue } from 'jotai';

import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';

import {
  SIDEBAR_PATHS_FOR_RECOIL_LAYERS,
  sidebarPathVisibilityState,
} from './sidebar-recoil-bridge';
import { sidebarPathVisibilityAtomFamily } from './sidebar-state';

function SyncPathVisibilityToRecoil({ path }: { path: string }) {
  const visible = useAtomValue(sidebarPathVisibilityAtomFamily(path));
  useSyncValueToRecoil(visible, sidebarPathVisibilityState(path));
  return null;
}

/** Mirrors Jotai hierarchical sidebar visibility into Recoil for unmigrated layer selectors. */
export function SidebarPathVisibilityRecoilBridge() {
  return (
    <>
      {SIDEBAR_PATHS_FOR_RECOIL_LAYERS.map((path) => (
        <SyncPathVisibilityToRecoil key={path} path={path} />
      ))}
    </>
  );
}
