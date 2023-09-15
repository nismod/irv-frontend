import _ from 'lodash';
import { TransactionInterface_UNSTABLE, atom, selector } from 'recoil';

import {
  CheckboxTreeState,
  buildTreeConfig,
  recalculateCheckboxStates,
} from '@/lib/controls/checkbox-tree/CheckboxTree';

import { NETWORK_LAYERS_HIERARCHY } from '@/config/networks/hierarchy';
import { NetworkLayerType } from '@/config/networks/metadata';

export const networkTreeExpandedState = atom<string[]>({
  key: 'networkTreeExpandedState',
  default: [],
});

export const networkTreeConfig = buildTreeConfig(NETWORK_LAYERS_HIERARCHY);

export const networkTreeCheckboxState = atom<CheckboxTreeState>({
  key: 'networkTreeSelectionState',
  default: {
    checked: _.mapValues(networkTreeConfig.nodes, () => false),
    indeterminate: _.mapValues(networkTreeConfig.nodes, () => false),
  },
});

export const networkSelectionState = selector<NetworkLayerType[]>({
  key: 'networkSelectionState',
  get: ({ get }) => {
    const checkboxState = get(networkTreeCheckboxState);

    return Object.keys(checkboxState.checked).filter(
      (id) => checkboxState.checked[id] && !networkTreeConfig.nodes[id].children,
    ) as NetworkLayerType[];
  },
});

export function syncInfrastructureSelectionStateEffect(
  { get, set }: TransactionInterface_UNSTABLE,
  layers: string[],
) {
  const currentSelection = get(networkTreeCheckboxState);
  const updatedTreeState = {
    checked: {
      ..._.mapValues(currentSelection.checked, () => false),
      ..._.fromPairs(layers.map((layer) => [layer, true])),
    },
    indeterminate: {},
  };
  const resolvedTreeState = recalculateCheckboxStates(updatedTreeState, networkTreeConfig);

  set(networkTreeCheckboxState, resolvedTreeState);
}
