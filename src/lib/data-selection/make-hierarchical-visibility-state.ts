import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import type { JotaiStateFamily } from '@/lib/jotai/types';
import { getParentPath } from '@/lib/paths/utils';

/** Writable atom family: effective visibility (self preference ∧ parent visible). */
export type HierarchicalVisibilityAtomFamily = JotaiStateFamily<boolean, string>;

export function makeHierarchicalVisibilityAtomFamily(
  singleVisibilityAtomFamily: JotaiStateFamily<boolean, string>,
): HierarchicalVisibilityAtomFamily {
  const hierarchicalVisibilityAtomFamily = atomFamily((path: string) =>
    atom(
      (get) => {
        const parentPath = getParentPath(path);
        return (
          (parentPath === '' || get(hierarchicalVisibilityAtomFamily(parentPath))) &&
          get(singleVisibilityAtomFamily(path))
        );
      },
      (get, set, newVisibility: boolean) => {
        if (newVisibility) {
          set(singleVisibilityAtomFamily(path), true);
          const parentPath = getParentPath(path);
          if (parentPath !== '' && get(hierarchicalVisibilityAtomFamily(parentPath)) === false) {
            set(hierarchicalVisibilityAtomFamily(parentPath), true);
          }
        } else {
          set(singleVisibilityAtomFamily(path), false);
        }
      },
    ),
  );

  return hierarchicalVisibilityAtomFamily as HierarchicalVisibilityAtomFamily;
}
