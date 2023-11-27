import { TreeItem } from '@mui/lab';
import { Checkbox, FormControlLabel } from '@mui/material';
import { MouseEventHandler, useCallback } from 'react';

import { CheckboxTreeState } from './CheckboxTree';
import { TreeNode } from './tree-node';

/** CheckboxTree sub-component responsible for rendering the subtree for a given node. */
export function CheckboxTreeItem<T>({
  root,
  handleChange,
  checkboxState,
  getLabel,
  disableCheck = false,
  toggleOnLeafClick = true,
}: {
  /** The root tree node for this subtree */
  root: TreeNode<T>;
  /** Function used to handle the checked state change for a node. */
  handleChange: (checked: boolean, node: TreeNode<T>) => void;
  /** Checkbox state for the whole tree (including ancestors of the current node) */
  checkboxState: CheckboxTreeState;
  /** Function to get a label (text or RectNode) for a node */
  getLabel: (node: TreeNode<T>) => any;
  /** Should the checkboxes of the tree be disabled. False by default. */
  disableCheck?: boolean;
  /**
   * When clicking on a leaf item, should the checkbox be toggled? True by default.
   *
   * If false, clicking on a leaf item only highlights it.
   */
  toggleOnLeafClick?: boolean;
}) {
  // set checked to true if indeterminate, so that clicking on an indeterminate node toggles it off, not on
  const effectiveChecked = checkboxState.indeterminate[root.id] || checkboxState.checked[root.id];

  const isLeaf = !root.children || root.children.length === 0;
  const handleLeafClick = useCallback<MouseEventHandler<HTMLLIElement>>(
    (e) => {
      handleChange(!effectiveChecked, root);
    },
    [effectiveChecked, handleChange, root],
  );

  return (
    <TreeItem
      key={root.id}
      nodeId={root.id}
      onClick={toggleOnLeafClick && isLeaf ? handleLeafClick : undefined}
      label={
        <FormControlLabel
          key={root.id}
          label={getLabel(root)}
          style={{ pointerEvents: 'none' }}
          control={
            <Checkbox
              checked={effectiveChecked}
              indeterminate={checkboxState.indeterminate[root.id]}
              onChange={(event) => handleChange(event.currentTarget.checked, root)}
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
              disabled={disableCheck}
            />
          }
        ></FormControlLabel>
      }
    >
      {root.children?.map((node) => (
        <CheckboxTreeItem
          key={node.id}
          root={node}
          handleChange={handleChange}
          checkboxState={checkboxState}
          getLabel={getLabel}
          disableCheck={disableCheck}
          toggleOnLeafClick={toggleOnLeafClick}
        ></CheckboxTreeItem>
      ))}
    </TreeItem>
  );
}
