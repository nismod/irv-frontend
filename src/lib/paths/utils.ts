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
