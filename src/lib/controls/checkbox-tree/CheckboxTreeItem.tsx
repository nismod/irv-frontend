import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TreeItem } from '@mui/x-tree-view';
import { ChangeEvent, KeyboardEvent, MouseEvent, MouseEventHandler, useCallback } from 'react';

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
      e.preventDefault();
      e.stopPropagation();
      handleChange(!effectiveChecked, root);
    },
    [effectiveChecked, handleChange, root],
  );

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(event.currentTarget.checked, root);
    },
    [handleChange, root],
  );

  const handleCheckboxClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  const handleItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLLIElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        handleChange(!effectiveChecked, root);
      }
    },
    [effectiveChecked, handleChange, root],
  );

  const ariaChecked = checkboxState.indeterminate[root.id]
    ? 'mixed'
    : checkboxState.checked[root.id]
      ? 'true'
      : 'false';

  const labelContent = getLabel(root);
  const ariaLabel =
    typeof labelContent === 'string'
      ? labelContent
      : ((root as { label?: string }).label ?? undefined);

  return (
    <TreeItem
      key={root.id}
      itemId={root.id}
      aria-checked={ariaChecked}
      onClick={toggleOnLeafClick && isLeaf ? handleLeafClick : undefined}
      onKeyDown={handleItemKeyDown}
      label={
        <FormControlLabel
          key={root.id}
          label={getLabel(root)}
          style={{ pointerEvents: 'none' }}
          control={
            <Checkbox
              checked={effectiveChecked}
              indeterminate={checkboxState.indeterminate[root.id]}
              onChange={handleCheckboxChange}
              onClick={handleCheckboxClick}
              disabled={disableCheck}
              slotProps={{ input: ariaLabel ? { 'aria-label': ariaLabel } : undefined }}
              sx={{ mr: 1 }}
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
