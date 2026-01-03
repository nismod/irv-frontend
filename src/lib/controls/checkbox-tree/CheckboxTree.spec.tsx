/* @vitest-environment jsdom */

import { act, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { buildTreeConfig, CheckboxTree, CheckboxTreeState } from './CheckboxTree';
import { TreeNode } from './tree-node';

type TestNode = TreeNode<{ label: string }>;

// Helper to create a simple tree with parent and child
function createTestTree(): TestNode[] {
  return [
    {
      id: 'parent',
      label: 'Parent',
      children: [
        { id: 'child1', label: 'Child 1' },
        { id: 'child2', label: 'Child 2' },
      ],
    },
  ];
}

// Helper to create initial state for a tree
function createInitialState(nodeIds: string[]): CheckboxTreeState {
  const state: CheckboxTreeState = {
    checked: {},
    indeterminate: {},
  };
  nodeIds.forEach((id) => {
    state.checked[id] = false;
    state.indeterminate[id] = false;
  });
  return state;
}

// Helper component for testing
function TestTreeComponent({
  nodes,
  initialState,
  initialExpanded = [],
  onStateChange,
  onExpandedChange,
}: {
  nodes: TestNode[];
  initialState: CheckboxTreeState;
  initialExpanded?: string[];
  onStateChange?: (state: CheckboxTreeState) => void;
  onExpandedChange?: (expanded: string[]) => void;
}) {
  const config = useMemo(() => buildTreeConfig(nodes), [nodes]);
  const [checkboxState, setCheckboxState] = useState<CheckboxTreeState>(initialState);
  const [expanded, setExpanded] = useState<string[]>(initialExpanded);

  const handleStateChange = (newState: CheckboxTreeState) => {
    setCheckboxState(newState);
    onStateChange?.(newState);
  };

  const handleExpandedChange = (newExpanded: string[]) => {
    setExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  };

  return (
    <CheckboxTree
      nodes={nodes}
      config={config}
      getLabel={(node) => node.label}
      checkboxState={checkboxState}
      onCheckboxState={handleStateChange}
      expanded={expanded}
      onExpanded={handleExpandedChange}
    />
  );
}

// DOM query helpers
function getTreeItem(container: HTMLElement, id?: string): HTMLElement | null {
  if (id) {
    return container.querySelector(`[role="treeitem"][id*="${id}"]`) as HTMLElement | null;
  }
  return container.querySelector('[role="treeitem"]') as HTMLElement | null;
}

function getParentTreeItem(container: HTMLElement): HTMLElement | null {
  return container.querySelector('[role="treeitem"][aria-checked]') as HTMLElement | null;
}

function getCheckbox(treeItem: HTMLElement | null): HTMLInputElement | null {
  if (!treeItem) return null;
  return treeItem.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
}

// Helper to click on non-leaf node label (Box structure)
function clickNonLeafNodeLabel(treeItem: HTMLElement): void {
  const labelContainer = treeItem.querySelector('span[class*="MuiBox"]') as HTMLElement;
  if (labelContainer) {
    // Find the text span (second span child, not the one with the checkbox)
    const textSpan = Array.from(labelContainer.children).find(
      (el) => el.tagName === 'SPAN' && !el.querySelector('input'),
    ) as HTMLElement;
    if (textSpan) {
      textSpan.click();
    } else {
      labelContainer.click();
    }
  } else {
    treeItem.click();
  }
}

describe('CheckboxTree', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeAll(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  describe('Mouse interactions', () => {
    describe('Leaf nodes', () => {
      it('toggles checkbox when clicking directly on checkbox', () => {
        const nodes: TestNode[] = [{ id: 'leaf', label: 'Leaf' }];
        const initialState = createInitialState(['leaf']);
        let lastState: CheckboxTreeState | undefined;

        act(() => {
          root.render(
            <TestTreeComponent
              nodes={nodes}
              initialState={initialState}
              onStateChange={(state) => {
                lastState = state;
              }}
            />,
          );
        });

        const treeItem = getTreeItem(container);
        const checkbox = getCheckbox(treeItem);
        expect(checkbox).not.toBeNull();
        expect(checkbox?.checked).toBe(false);

        // Click directly on the checkbox
        act(() => {
          checkbox?.click();
        });

        expect(checkbox?.checked).toBe(true);
        expect(lastState?.checked['leaf']).toBe(true);
      });

      it('toggles checkbox when clicking on label text', () => {
        const nodes: TestNode[] = [{ id: 'leaf', label: 'Leaf' }];
        const initialState = createInitialState(['leaf']);

        act(() => {
          root.render(<TestTreeComponent nodes={nodes} initialState={initialState} />);
        });

        const treeItem = getTreeItem(container);
        const checkbox = getCheckbox(treeItem);
        const label = treeItem?.querySelector('label') as HTMLLabelElement;
        expect(checkbox?.checked).toBe(false);

        // Click on the label text (not the checkbox)
        act(() => {
          const labelText = Array.from(label.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE || node.nodeName === 'SPAN',
          ) as HTMLElement;
          if (labelText) {
            labelText.click();
          } else {
            label.click();
          }
        });

        expect(checkbox?.checked).toBe(true);
      });

      it('toggles checkbox when clicking anywhere on the tree item', () => {
        const nodes: TestNode[] = [{ id: 'leaf', label: 'Leaf' }];
        const initialState = createInitialState(['leaf']);

        act(() => {
          root.render(<TestTreeComponent nodes={nodes} initialState={initialState} />);
        });

        const treeItem = getTreeItem(container);
        const checkbox = getCheckbox(treeItem);
        expect(checkbox?.checked).toBe(false);

        // Click on the tree item (but not on checkbox or label)
        act(() => {
          const clickEvent = new MouseEvent('click', { bubbles: true });
          treeItem?.dispatchEvent(clickEvent);
        });

        expect(checkbox?.checked).toBe(true);
      });
    });

    describe('Non-leaf nodes', () => {
      it('toggles checkbox when clicking directly on checkbox', () => {
        const nodes = createTestTree();
        const initialState = createInitialState(['parent', 'child1', 'child2']);

        act(() => {
          root.render(<TestTreeComponent nodes={nodes} initialState={initialState} />);
        });

        const parentTreeItem = getParentTreeItem(container);
        const parentCheckbox = getCheckbox(parentTreeItem);
        expect(parentCheckbox).not.toBeNull();
        expect(parentCheckbox?.checked).toBe(false);

        // Click directly on the checkbox
        act(() => {
          parentCheckbox?.click();
        });

        expect(parentCheckbox?.checked).toBe(true);
      });

      it('expands/collapses when clicking on label text (does not toggle checkbox)', () => {
        const nodes = createTestTree();
        const initialState = createInitialState(['parent', 'child1', 'child2']);
        let expandedState: string[] = [];
        let lastState: CheckboxTreeState = initialState;

        act(() => {
          root.render(
            <TestTreeComponent
              nodes={nodes}
              initialState={initialState}
              onStateChange={(state) => {
                lastState = state;
              }}
              onExpandedChange={(expanded) => {
                expandedState = expanded;
              }}
            />,
          );
        });

        const parentTreeItem = getParentTreeItem(container);
        const parentCheckbox = getCheckbox(parentTreeItem);
        const initialCheckedState = lastState.checked['parent'];

        // Click on the label text (not the checkbox)
        act(() => {
          clickNonLeafNodeLabel(parentTreeItem!);
        });

        // Checkbox state should not have changed (check state, not DOM)
        expect(lastState.checked['parent']).toBe(initialCheckedState);
        // Tree should have expanded
        expect(expandedState).toContain('parent');
      });

      it('does not toggle checkbox when clicking on tree item area (non-label, non-checkbox)', () => {
        const nodes = createTestTree();
        const initialState = createInitialState(['parent', 'child1', 'child2']);

        act(() => {
          root.render(<TestTreeComponent nodes={nodes} initialState={initialState} />);
        });

        const parentTreeItem = getParentTreeItem(container);
        const parentCheckbox = getCheckbox(parentTreeItem);
        const initialChecked = parentCheckbox?.checked;

        // Click on the tree item but not on checkbox or label
        act(() => {
          const clickEvent = new MouseEvent('click', { bubbles: true });
          parentTreeItem?.dispatchEvent(clickEvent);
        });

        // Checkbox should not have changed (unlike leaf nodes)
        expect(parentCheckbox?.checked).toBe(initialChecked);
      });
    });
  });

  describe('Keyboard interactions', () => {
    describe('Leaf nodes', () => {
      it('toggles checkbox when Space is pressed', () => {
        const nodes: TestNode[] = [{ id: 'leaf', label: 'Leaf' }];
        const initialState = createInitialState(['leaf']);

        act(() => {
          root.render(<TestTreeComponent nodes={nodes} initialState={initialState} />);
        });

        const treeItem = getTreeItem(container);
        const checkbox = getCheckbox(treeItem);

        act(() => {
          treeItem?.focus();
          treeItem?.dispatchEvent(
            new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }),
          );
        });

        expect(checkbox?.checked).toBe(true);
        expect(treeItem?.getAttribute('aria-checked')).toBe('true');
      });

      it('toggles checkbox when Enter is pressed', () => {
        const nodes: TestNode[] = [{ id: 'leaf', label: 'Leaf' }];
        const initialState = createInitialState(['leaf']);

        act(() => {
          root.render(<TestTreeComponent nodes={nodes} initialState={initialState} />);
        });

        const treeItem = getTreeItem(container);
        const checkbox = getCheckbox(treeItem);

        act(() => {
          treeItem?.focus();
          treeItem?.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }),
          );
        });

        expect(checkbox?.checked).toBe(true);
        expect(treeItem?.getAttribute('aria-checked')).toBe('true');
      });
    });

    describe('Non-leaf nodes', () => {
      it('toggles checkbox when Space is pressed', () => {
        const nodes = createTestTree();
        const initialState = createInitialState(['parent', 'child1', 'child2']);

        act(() => {
          root.render(<TestTreeComponent nodes={nodes} initialState={initialState} />);
        });

        const parentTreeItem = getParentTreeItem(container);
        const parentCheckbox = getCheckbox(parentTreeItem);

        act(() => {
          parentTreeItem?.focus();
          parentTreeItem?.dispatchEvent(
            new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }),
          );
        });

        expect(parentCheckbox?.checked).toBe(true);
        expect(parentTreeItem?.getAttribute('aria-checked')).toBe('true');
      });

      it('expands/collapses when Enter is pressed (does not toggle checkbox)', () => {
        const nodes = createTestTree();
        const initialState = createInitialState(['parent', 'child1', 'child2']);
        let expandedState: string[] = [];

        act(() => {
          root.render(
            <TestTreeComponent
              nodes={nodes}
              initialState={initialState}
              onExpandedChange={(expanded) => {
                expandedState = expanded;
              }}
            />,
          );
        });

        const parentTreeItem = getParentTreeItem(container);
        const parentCheckbox = getCheckbox(parentTreeItem);
        const initialChecked = parentCheckbox?.checked;

        act(() => {
          parentTreeItem?.focus();
          parentTreeItem?.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }),
          );
        });

        // Checkbox should not have changed
        expect(parentCheckbox?.checked).toBe(initialChecked);
        // Tree should have expanded
        expect(expandedState).toContain('parent');
      });
    });
  });

  describe('Checkbox state propagation', () => {
    it('checks all children when parent is checked', () => {
      const nodes = createTestTree();
      const initialState = createInitialState(['parent', 'child1', 'child2']);
      let lastState: CheckboxTreeState | undefined;

      act(() => {
        root.render(
          <TestTreeComponent
            nodes={nodes}
            initialState={initialState}
            onStateChange={(state) => {
              lastState = state;
            }}
          />,
        );
      });

      const parentTreeItem = getParentTreeItem(container);
      const parentCheckbox = getCheckbox(parentTreeItem);

      act(() => {
        parentCheckbox?.click();
      });

      // All nodes should be checked
      expect(lastState?.checked['parent']).toBe(true);
      expect(lastState?.checked['child1']).toBe(true);
      expect(lastState?.checked['child2']).toBe(true);
    });
  });

  describe('Expand/collapse behavior', () => {
    it('expands node when clicking label on non-leaf node', () => {
      const nodes = createTestTree();
      const initialState = createInitialState(['parent', 'child1', 'child2']);
      let expandedState: string[] = [];

      act(() => {
        root.render(
          <TestTreeComponent
            nodes={nodes}
            initialState={initialState}
            onExpandedChange={(expanded) => {
              expandedState = expanded;
            }}
          />,
        );
      });

      const parentTreeItem = getParentTreeItem(container);
      expect(expandedState).not.toContain('parent');

      act(() => {
        clickNonLeafNodeLabel(parentTreeItem!);
      });

      expect(expandedState).toContain('parent');
    });

    it('collapses node when clicking label on expanded non-leaf node', () => {
      const nodes = createTestTree();
      const initialState = createInitialState(['parent', 'child1', 'child2']);
      let expandedState: string[] = ['parent'];

      act(() => {
        root.render(
          <TestTreeComponent
            nodes={nodes}
            initialState={initialState}
            initialExpanded={['parent']}
            onExpandedChange={(expanded) => {
              expandedState = expanded;
            }}
          />,
        );
      });

      const parentTreeItem = getParentTreeItem(container);
      expect(expandedState).toContain('parent');

      act(() => {
        clickNonLeafNodeLabel(parentTreeItem!);
      });

      // The expanded state should be updated (parent removed from array)
      expect(expandedState.length).toBe(0);
    });
  });
});
