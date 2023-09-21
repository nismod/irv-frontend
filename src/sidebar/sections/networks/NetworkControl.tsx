import { FC } from 'react';
import { useRecoilState } from 'recoil';

import { CheckboxTree } from '@/lib/controls/checkbox-tree/CheckboxTree';

import { NETWORK_LAYERS_HIERARCHY } from '@/config/networks/hierarchy';
import { NETWORKS_METADATA } from '@/config/networks/metadata';
import { LayerLabel } from '@/sidebar/ui/LayerLabel';
import {
  networkTreeCheckboxState,
  networkTreeConfig,
  networkTreeExpandedState,
} from '@/state/data-selection/networks/network-selection';

export const NetworkControl: FC<{}> = () => {
  const [checkboxState, setCheckboxState] = useRecoilState(networkTreeCheckboxState);
  const [expanded, setExpanded] = useRecoilState(networkTreeExpandedState);

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
