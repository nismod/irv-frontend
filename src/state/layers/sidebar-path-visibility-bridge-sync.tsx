import { useRecoilValue } from 'recoil';

import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';

import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import { adaptationNbsVisibleReplicaAtom } from '@/state/layers/data-layers/nbs';
import { exposureInfrastructureVisibleReplicaAtom } from '@/state/layers/data-layers/networks';

/**
 * Recoil↔Jotai migration bridge: Recoil sidebar path visibility → Jotai replica atoms
 * for layer gating (Slice 15 hub stays on Recoil until hub migration).
 */
export function SidebarPathVisibilityBridgeSync() {
  const nbsSidebarVisible = useRecoilValue(sidebarPathVisibilityState('adaptation/nbs'));
  useSyncValueToAtom(nbsSidebarVisible, adaptationNbsVisibleReplicaAtom);

  const exposureInfrastructureVisible = useRecoilValue(
    sidebarPathVisibilityState('exposure/infrastructure'),
  );
  useSyncValueToAtom(exposureInfrastructureVisible, exposureInfrastructureVisibleReplicaAtom);

  return null;
}
