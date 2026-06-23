import { atom } from 'jotai';
import _ from 'lodash';

import {
  buildTreeConfig,
  CheckboxTreeState,
  recalculateCheckboxStates,
} from '@/lib/controls/checkbox-tree/CheckboxTree';
import type { StoreOps } from '@/lib/jotai/effects/store-ops';

import { NETWORK_LAYERS_HIERARCHY } from '@/config/networks/hierarchy';
import { NetworkLayerType } from '@/config/networks/metadata';

export const networkTreeExpandedAtom = atom<string[]>([]);

export const networkTreeConfig = buildTreeConfig(NETWORK_LAYERS_HIERARCHY);

const INITIAL_NETWORK_TREE_CHECKBOX: CheckboxTreeState = {
  checked: _.mapValues(networkTreeConfig.nodes, () => false),
  indeterminate: _.mapValues(networkTreeConfig.nodes, () => false),
};
export const networkTreeCheckboxAtom = atom(INITIAL_NETWORK_TREE_CHECKBOX);

export const networkSelectionAtom = atom((get): NetworkLayerType[] => {
  const checkboxState = get(networkTreeCheckboxAtom);

  return Object.keys(checkboxState.checked).filter(
    (id) => checkboxState.checked[id] && !networkTreeConfig.nodes[id].children,
  ) as NetworkLayerType[];
});

export function syncInfrastructureSelectionStateEffect({ get, set }: StoreOps, layers: string[]) {
  const currentSelection = get(networkTreeCheckboxAtom);
  const updatedTreeState = {
    checked: {
      ..._.mapValues(currentSelection.checked, () => false),
      ..._.fromPairs(layers.map((layer) => [layer, true])),
    },
    indeterminate: {},
  };
  const resolvedTreeState = recalculateCheckboxStates(updatedTreeState, networkTreeConfig);

  set(networkTreeCheckboxAtom, resolvedTreeState);
}
