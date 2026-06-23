import { atom } from 'jotai';

import { StyleParams, ViewLayer } from '@/lib/data-map/view-layers';

import { infrastructureViewLayer } from '@/config/networks/infrastructure-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { damageMapStyleParamsAtom } from '@/state/data-selection/damage-mapping/damage-style-params';
import { networkSelectionAtom } from '@/state/data-selection/networks/network-selection';
import { networksStyleAtom } from '@/state/data-selection/networks/networks-style';

export const networkStyleParamsAtom = atom<StyleParams>((get) => {
  switch (get(networksStyleAtom)) {
    case 'damages':
      return get(damageMapStyleParamsAtom);
    default:
      return {};
  }
});

export const networkLayersAtom = atom<ViewLayer[]>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/infrastructure'))
    ? get(networkSelectionAtom).map((network) =>
        infrastructureViewLayer(network, get(networkStyleParamsAtom)),
      )
    : [],
);
