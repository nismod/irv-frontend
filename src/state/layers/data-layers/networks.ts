import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { StyleParams, ViewLayer } from '@/lib/data-map/view-layers';

import { infrastructureViewLayer } from '@/config/networks/infrastructure-view-layer';
import { damageMapStyleParamsAtom } from '@/state/data-selection/damage-mapping/damage-style-params';
import { networkSelectionAtom } from '@/state/data-selection/networks/network-selection';
import { networksStyleAtom } from '@/state/data-selection/networks/networks-style';

/**
 * Recoil↔Jotai migration: sidebar path visibility is still Recoil (Slice 15).
 * `SidebarPathVisibilityBridgeSync` syncs `sidebarPathVisibilityState('exposure/infrastructure')` here.
 */
export const exposureInfrastructureVisibleReplicaAtom = jotaiAtom<boolean>(false);

export const networkStyleParamsAtom = jotaiAtom((get): StyleParams => {
  switch (get(networksStyleAtom)) {
    case 'damages':
      return get(damageMapStyleParamsAtom);
    default:
      return {};
  }
});

export const networkLayersAtom = jotaiAtom((get): ViewLayer[] => {
  return get(exposureInfrastructureVisibleReplicaAtom)
    ? get(networkSelectionAtom).map((network) =>
        infrastructureViewLayer(network, get(networkStyleParamsAtom)),
      )
    : [];
});

/**
 * Recoil↔Jotai migration: network view layers are computed in Jotai (`networkLayersAtom`).
 * `ViewLayersBridgeSync` writes into this replica atom so `viewLayersState` keeps its ordering.
 */
export const networkLayersState = atom<ViewLayer[]>({
  key: 'networkLayersState',
  default: [],
});
