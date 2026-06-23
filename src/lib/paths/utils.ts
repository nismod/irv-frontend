export function getParentPath(path: string) {
  if (path === '') {
    throw new Error("Empty path doesn't have a parent");
  }
  const idx = path.lastIndexOf('/');
  if (idx === -1) {
    return '';
  }
  return path.slice(0, idx);
}

export function makeChildPath(parentPath: string, subPath: string) {
  return parentPath === '' ? subPath : `${parentPath}/${subPath}`;
}

/** All descendant paths under `root`, in depth-first order (segment IDs from `getChildren`). */
export function collectAllPathsUnder(
  root: string,
  getChildren: (path: string) => readonly string[],
): string[] {
  return getChildren(root).flatMap((childId) => {
    const childPath = makeChildPath(root, childId);
    return [childPath, ...collectAllPathsUnder(childPath, getChildren)];
  });
}
