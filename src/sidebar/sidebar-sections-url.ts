import { makeChildPath } from '@/lib/paths/utils';

export interface SectionsTree {
  [key: string]: boolean | SectionsTree;
}

function splitFirst(str: string, sep: string): [string, string | undefined] {
  const idx = str.indexOf(sep);
  if (idx === -1) {
    return [str, undefined];
  }
  return [str.substring(0, idx), str.substring(idx + 1)];
}

export function pathToVisibility(
  obj: SectionsTree | boolean | null | undefined,
  path: string,
): boolean {
  if (path === '') return true;
  if (obj == null) return false;

  const [next, restPath] = splitFirst(path, '/');
  const nextObject = (obj as SectionsTree)[next];

  if (restPath == null) {
    return nextObject == null ? false : typeof nextObject === 'boolean' ? nextObject : true;
  }

  return pathToVisibility(nextObject as SectionsTree | boolean | null | undefined, restPath);
}

export function isSectionsTree(value: unknown): value is SectionsTree {
  if (typeof value !== 'object' || value == null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === 'boolean' || isSectionsTree(entry));
}

/**
 * Build the outward `sections` URL tree from per-path visibility and registered children.
 * Omits paths where `isPathVisible` is false.
 */
export function constructSectionsUrlTree(
  path: string,
  isPathVisible: (path: string) => boolean,
  getChildIds: (path: string) => readonly string[],
): SectionsTree | boolean | null {
  if (path !== '' && !isPathVisible(path)) {
    return null;
  }

  const children = getChildIds(path);

  if (children.length === 0) {
    return true;
  }

  const entries = children
    .map((child) => {
      const childPath = makeChildPath(path, child);
      const value = constructSectionsUrlTree(childPath, isPathVisible, getChildIds);
      return value == null ? null : ([child, value] as const);
    })
    .filter((entry): entry is readonly [string, SectionsTree | boolean] => entry != null);

  return Object.fromEntries(entries);
}

/** Apply URL `sections` tree to per-path preference setters (initial load / external URL only). */
export function hydratePreferencesFromUrlTree(
  tree: SectionsTree,
  path: string,
  setPreference: (path: string, visible: boolean) => void,
): void {
  for (const [key, child] of Object.entries(tree)) {
    const childPath = path === '' ? key : makeChildPath(path, key);
    if (typeof child === 'boolean') {
      setPreference(childPath, child);
    } else {
      setPreference(childPath, true);
      hydratePreferencesFromUrlTree(child, childPath, setPreference);
    }
  }
}
