/* @vitest-environment jsdom */

import { act, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { buildTreeConfig, CheckboxTree, CheckboxTreeState } from './CheckboxTree';
import { TreeNode } from './tree-node';

function TestTree() {
  const nodes = useMemo<TreeNode<{ label: string }>[]>(() => [{ id: 'leaf', label: 'Leaf' }], []);
  const config = useMemo(() => buildTreeConfig(nodes), [nodes]);
  const [checkboxState, setCheckboxState] = useState<CheckboxTreeState>({
    checked: { leaf: false },
    indeterminate: { leaf: false },
  });

  return (
    <CheckboxTree
      nodes={nodes}
      config={config}
      getLabel={(node) => node.label}
      checkboxState={checkboxState}
      onCheckboxState={setCheckboxState}
      expanded={[]}
      onExpanded={() => {}}
    />
  );
}

describe('CheckboxTree keyboard interaction', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeAll(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<TestTree />);
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('toggles a leaf item when space or enter is pressed', () => {
    const treeItem = container.querySelector('[role="treeitem"]') as HTMLElement | null;
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement | null;

    expect(treeItem).not.toBeNull();
    expect(checkbox).not.toBeNull();

    act(() => {
      treeItem?.focus();
    });

    act(() => {
      treeItem?.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }),
      );
    });

    expect(checkbox?.checked).toBe(true);
    expect(treeItem?.getAttribute('aria-checked')).toBe('true');

    act(() => {
      treeItem?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }),
      );
    });

    expect(checkbox?.checked).toBe(false);
    expect(treeItem?.getAttribute('aria-checked')).toBe('false');
  });
});
