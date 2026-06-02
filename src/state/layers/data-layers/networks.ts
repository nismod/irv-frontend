import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { StyleParams, ViewLayer } from '@/lib/data-map/view-layers';

import { infrastructureViewLayer } from '@/config/networks/infrastructure-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { damageMapStyleParamsAtom } from '@/state/data-selection/damage-mapping/damage-style-params';
import { networkSelectionAtom } from '@/state/data-selection/networks/network-selection';
import { networksStyleAtom } from '@/state/data-selection/networks/networks-style';

export const networkStyleParamsAtom = jotaiAtom((get): StyleParams => {
  switch (get(networksStyleAtom)) {
    case 'damages':
      return get(damageMapStyleParamsAtom);
    default:
      return {};
  }
});

export const networkLayersAtom = jotaiAtom((get): ViewLayer[] => {
  return get(sidebarPathVisibilityAtomFamily('exposure/infrastructure'))
    ? get(networkSelectionAtom).map((network) =>
        infrastructureViewLayer(network, get(networkStyleParamsAtom)),
      )
    : [];
});

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `networkLayersAtom`. */
export const networkLayersState = atom<ViewLayer[]>({
  key: 'networkLayersState',
  default: [],
});
