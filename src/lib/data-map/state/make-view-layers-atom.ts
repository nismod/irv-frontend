import { atom, Atom } from 'jotai';

import { ConfigTree } from '@/lib/nested-config/config-tree';
import { flattenConfig } from '@/lib/nested-config/flatten-config';

import { ViewLayer } from '../view-layers';

type ViewLayerSlot = ConfigTree<ViewLayer>[number];

export function makeViewLayersAtom(layerAtoms: readonly Atom<ViewLayerSlot>[]) {
  return atom((get) => flattenConfig(layerAtoms.map((layerAtom) => get(layerAtom))));
}
