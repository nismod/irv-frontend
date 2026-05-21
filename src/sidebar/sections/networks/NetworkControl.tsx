import { useAtom } from 'jotai';
import { FC } from 'react';

import { CheckboxTree } from '@/lib/controls/checkbox-tree/CheckboxTree';

import { NETWORK_LAYERS_HIERARCHY } from '@/config/networks/hierarchy';
import { NETWORKS_METADATA } from '@/config/networks/metadata';
import { LayerLabel } from '@/sidebar/ui/LayerLabel';
import {
  networkTreeCheckboxAtom,
  networkTreeConfig,
  networkTreeExpandedAtom,
} from '@/state/data-selection/networks/network-selection';

export const NetworkControl: FC<{}> = () => {
  const [checkboxState, setCheckboxState] = useAtom(networkTreeCheckboxAtom);
  const [expanded, setExpanded] = useAtom(networkTreeExpandedAtom);

  return (
    <CheckboxTree
      nodes={NETWORK_LAYERS_HIERARCHY}
      config={networkTreeConfig}
      getLabel={(node) =>
        node.children ? (
          node.label
        ) : (
          <LayerLabel {...NETWORKS_METADATA[node.id]} label={node.label} />
        )
      }
      checkboxState={checkboxState}
      onCheckboxState={setCheckboxState}
      expanded={expanded}
      onExpanded={setExpanded}
    />
  );
};
