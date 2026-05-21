import { useAtomValue } from 'jotai';
import { useRecoilValue } from 'recoil';

import { useSyncValueToAtom } from '@/lib/jotai/state-sync/use-sync-state';
import { useSyncValueToRecoil } from '@/lib/recoil/state-sync/use-sync-state';

import { sidebarPathVisibilityState } from '@/sidebar/SidebarContent';
import {
  adaptationNbsVisibleReplicaAtom,
  nbsLayerAtom,
  nbsLayerState,
  nbsScopeRegionLayerAtom,
  nbsScopeRegionLayerState,
} from '@/state/layers/data-layers/nbs';
import {
  featureBoundingBoxLayerAtom,
  featureBoundingBoxLayerState,
} from '@/state/layers/ui-layers/feature-bbox';

/**
 * Recoil↔Jotai migration bridge (Slice 10): Jotai NbS/bbox layers → Recoil `viewLayersState` hub.
 * Sidebar visibility is Recoil → Jotai replica for layer gating.
 */
export function NbsViewLayersSync() {
  const sidebarVisible = useRecoilValue(sidebarPathVisibilityState('adaptation/nbs'));
  useSyncValueToAtom(sidebarVisible, adaptationNbsVisibleReplicaAtom);

  const nbsLayer = useAtomValue(nbsLayerAtom);
  const nbsScopeRegionLayer = useAtomValue(nbsScopeRegionLayerAtom);
  const featureBboxLayer = useAtomValue(featureBoundingBoxLayerAtom);

  useSyncValueToRecoil(nbsLayer, nbsLayerState);
  useSyncValueToRecoil(nbsScopeRegionLayer, nbsScopeRegionLayerState);
  useSyncValueToRecoil(featureBboxLayer, featureBoundingBoxLayerState);

  return null;
}
