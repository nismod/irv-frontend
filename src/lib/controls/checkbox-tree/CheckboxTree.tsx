import { SimpleTreeView } from '@mui/x-tree-view';
import { produce } from 'immer';
import { useCallback } from 'react';

import { CheckboxTreeItem } from './CheckboxTreeItem';
import { dfs, getDescendants, TreeNode } from './tree-node';

/**
 * Internal config object for the CheckboxTree UI component.
 *
 * Describes the structure of a tree/forest in a way which eliminates the need to run
 * recursive computations to check if one node is an ancestor/descendant of another one,
 * during use of the CheckboxTree.
 *
 * Note that the data structure isn't actually a single tree -
 * it's potentially a forest multiple trees/roots
 */
export interface CheckboxTreeConfig<T> {
  /** The roots of the data hierarchy */
  roots: TreeNode<T>[];
  /** A lookup of all the nodes in the data structure, by ID */
  nodes: {
    [nodeId: string]: TreeNode<T> & {
      /** An array of the IDs of all descendants of this node. Includes children, and further descendants. */
      descendantIds: string[];
    };
  };
}

/** Helper function to build an internal CheckboxTree config from a list of tree roots */
export function buildTreeConfig<T>(
  /** An array of `TreeNode` objects representing the roots of the data structure */
  nodes: TreeNode<T>[],
): CheckboxTreeConfig<T> {
  const config: CheckboxTreeConfig<T> = {
    roots: nodes,
    nodes: {},
  };

  nodes.forEach((node) => {
    dfs(node, (node) => {
      config.nodes[node.id] = {
        ...node,
        descendantIds: getDescendants(node),
      };
    });
  });
  return config;
}

/**
 * The internal state of a CheckboxTree. Used to determine how to visualise the UI state of each tree node.
 *
 * Checked and indeterminate states are stored separately because this format is easiest to use
 * in MaterialUI's
 */
export interface CheckboxTreeState {
  /** A lookup (by ID) of the checked state of all tree nodes.
   *  A node is checked if and only if all of its descendants are checked.
   * */
  checked: { [nodeId: string]: boolean };
  /** A lookup (by ID) of the indeterminate state of all tree nodes.
   * A node is indeterminate if and only if some, but not all, of its descendants are checked.
   */
  indeterminate: { [nodeId: string]: boolean };
}

/** Recalculate the checked/indeterminate state of a CheckboxTree after a modification to one or more of the nodes.
 *
 * Traverses all the trees in post-order fashion to update the state of each node, starting from leaf
 * nodes and only then considering their parents.
 *
 * Modifies the state object passed as argument, and returns it after the update is finished.
 */
export function recalculateCheckboxStates<T>(
  /** The state of the tree that is potentially inconsistent after a change was applied to one or more of the nodes */
  state: CheckboxTreeState,
  /** The tree config describing the structure of the tree/forest */
  config: CheckboxTreeConfig<T>,
): CheckboxTreeState {
  for (const root of config.roots) {
    // traverse each root tree in post-order to recalculate state starting from leaf nodes
    dfs(
      root,
      (node) => {
        const nodeChildren = config.nodes[node.id].children;
        if (nodeChildren) {
          const checked = nodeChildren.every((child) => state.checked[child.id]);
          const indeterminate =
            !checked &&
            nodeChildren.some((child) => state.checked[child.id] || state.indeterminate[child.id]);
          state.checked[node.id] = checked;
          state.indeterminate[node.id] = indeterminate;
        }
      },
      false,
      'post',
    );
  }

  return state;
}

/** A UI component which displays (potentially many) expandable tree structures, where each tree node has a checkbox.
 *
 * Each node can be checked, unchecked or indeterminate (if some but not all of its descendants are checked)
 */
export function CheckboxTree<T>({
  nodes,
  config,
  getLabel,
  checkboxState,
  onCheckboxState,
  expanded,
  onExpanded,
  disableCheck = false,
  toggleOnLeafClick = true,
}: {
  /** Config object describing the structure of the tree data */
  config: CheckboxTreeConfig<T>;
  /** Array of the root nodes */
  nodes: TreeNode<T>[];
  /** Function to get a label (text/ReactNode) for a tree node */
  getLabel: (node: TreeNode<T>) => any;
  /** Checkbox state of the component */
  checkboxState: CheckboxTreeState;
  /** Handler function called when the checkbox state of the component changes */
  onCheckboxState: (state: CheckboxTreeState) => void;
  /** An array of IDs of the nodes that are expanded */
  expanded: string[];
  /** Handler function called when the list of expanded nodes changes */
  onExpanded: (expanded: string[]) => void;
  /** Should the checkboxes of the tree be disabled? False by default. */
  disableCheck?: boolean;
  /**
   * When clicking on a leaf item, should the checkbox be toggled? True by default.
   *
   * If false, upon clicking, a leaf node is simply highlighted.
   * @defaultValue true
   */
  toggleOnLeafClick?: boolean;
}) {
  const handleChange = useCallback(
    (checked: boolean, node: TreeNode<T>) => {
      const descendants: string[] = config.nodes[node.id].descendantIds;
      onCheckboxState(
        produce(checkboxState, (draft) => {
          draft.checked[node.id] = checked;
          descendants.forEach((n) => (draft.checked[n] = checked));

          return recalculateCheckboxStates(draft, config);
        }),
      );
    },
    [checkboxState, config, onCheckboxState],
  );

  return (
    <>
      <SimpleTreeView
        expandedItems={expanded}
        onExpandedItemsChange={(e, nodeIds) => onExpanded(nodeIds)}
      >
        {nodes.map((node) => (
          <CheckboxTreeItem
            key={node.id}
            root={node}
            checkboxState={checkboxState}
            handleChange={handleChange}
            getLabel={getLabel}
            disableCheck={disableCheck}
            toggleOnLeafClick={toggleOnLeafClick}
          />
        ))}
      </SimpleTreeView>
    </>
  );
}
