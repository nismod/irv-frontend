/** A generic tree node type
 * @template T the type of the tree's nodes (each node will also have `id` and `children` fields)
 */
export type TreeNode<T> = {
  /** String ID of the node (unique in the whole tree) */
  id: string;
  /** Array of children of this tree node */
  children?: TreeNode<T>[];
} & T;

/**
 * Perform a depth-first search traversal of the tree.
 * @param node Root node of the tree.
 * @param action Action to perform on each traversed node. If false is returned, the traversal is stopped.
 * @param skipRoot If true, the action is not performed on the root node.
 * @param order Order of traversal (pre-order or post-order) - determines if the action is called on a node before or after its children are traversed.
 * @returns False if the traversal should be stopped. Any other return value should be ignored.
 */
export function dfs<T>(
  node: TreeNode<T>,
  action: (node: TreeNode<T>) => any,
  skipRoot = false,
  order: 'pre' | 'post' = 'pre',
): any {
  if (order === 'pre' && !skipRoot) {
    const continueTraversal = action(node);

    if (continueTraversal === false) return false;
  }
  if (node.children) {
    for (const child of node.children) {
      const continueTraversal = dfs(child, action, false, order);

      if (continueTraversal === false) return false;
    }
  }
  if (order === 'post' && !skipRoot) {
    const continueTraversal = action(node);

    if (continueTraversal === false) return false;
  }
}

export function getNodeById<T>(node: TreeNode<T>, id: string) {
  let result: TreeNode<T> | null = null;

  dfs(node, (n) => {
    if (n.id === id) {
      result = n;
      return false;
    }
  });

  return result;
}

export function getDescendants<T>(node: TreeNode<T>) {
  const array: string[] = [];
  dfs(node, (n) => array.push(n.id), true);

  return array;
}
