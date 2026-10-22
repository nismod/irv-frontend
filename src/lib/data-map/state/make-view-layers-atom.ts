import { atom, Atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { ConfigTree } from '@/lib/nested-config/config-tree';
import { flattenConfig } from '@/lib/nested-config/flatten-config';

type ViewLayerSlot = ConfigTree<ViewLayer>[number];

export function makeViewLayersAtom(layerAtoms: readonly Atom<ViewLayerSlot>[]) {
  return atom((get) => flattenConfig(layerAtoms.map((layerAtom) => get(layerAtom))));
}
