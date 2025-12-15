import { Box } from '@mui/material';
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
      // Don't handle clicks that originate from the checkbox or label area
      // (the checkbox will handle those via its onChange handler)
      const target = e.target as HTMLElement;
      if (
        target.closest('input[type="checkbox"]') ||
        target.closest('.MuiFormControlLabel-root') ||
        target.closest('.MuiCheckbox-root')
      ) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      handleChange(!effectiveChecked, root);
    },
    [effectiveChecked, handleChange, root],
  );

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      handleChange(event.currentTarget.checked, root);
    },
    [handleChange, root],
  );

  const handleCheckboxClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }, []);

  const handleItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLLIElement>) => {
      if (event.key === ' ') {
        // Space key: Always toggle checkbox (standard pattern for checkboxes)
        event.preventDefault();
        event.stopPropagation();
        handleChange(!effectiveChecked, root);
      } else if (event.key === 'Enter') {
        if (isLeaf) {
          // Enter on leaf nodes: Toggle checkbox (no expand/collapse action available)
          event.preventDefault();
          event.stopPropagation();
          handleChange(!effectiveChecked, root);
        }
        // Enter on non-leaf nodes: Let TreeItem handle expand/collapse (don't prevent default)
        // This follows the standard pattern where Enter activates the default action (expand/collapse)
      }
      // Arrow keys are handled by TreeItem for navigation, so we don't need to handle them here
    },
    [effectiveChecked, handleChange, root, isLeaf],
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

  const checkbox = (
    <Checkbox
      checked={effectiveChecked}
      indeterminate={checkboxState.indeterminate[root.id]}
      onChange={handleCheckboxChange}
      onClick={handleCheckboxClick}
      disabled={disableCheck}
      slotProps={{
        input: ariaLabel ? { 'aria-label': ariaLabel } : undefined,
      }}
      sx={{ mr: 1 }}
    />
  );

  // For leaf nodes, use FormControlLabel so clicking label toggles checkbox
  // For non-leaf nodes, render separately so label clicks don't toggle checkbox
  // Override FormControlLabel's default margin-left: -11px to prevent checkbox clipping
  const labelElement = isLeaf ? (
    <FormControlLabel
      key={root.id}
      label={labelContent}
      control={checkbox}
      sx={{ ml: 0 }} // Remove the default -11px margin that causes checkbox clipping
    />
  ) : (
    <Box
      component="span"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {checkbox}
      <Box component="span">{labelContent}</Box>
    </Box>
  );

  return (
    <TreeItem
      key={root.id}
      itemId={root.id}
      aria-checked={ariaChecked}
      onClick={toggleOnLeafClick && isLeaf ? handleLeafClick : undefined}
      onKeyDown={handleItemKeyDown}
      label={labelElement}
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
