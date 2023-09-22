import { selectorFamily } from 'recoil';

import { getParentPath } from '../paths/paths';
import { RecoilStateFamily } from '../recoil/types';

export function makeHierarchicalVisibilityState(
  singleVisibilityState: RecoilStateFamily<boolean, string>,
) {
  const hierarchicalVisibilityState = selectorFamily<boolean, string>({
    key: 'sidebarPathVisibilityState',
    get:
      (path: string) =>
      ({ get }) => {
        const parentPath = getParentPath(path);

        return (
          (parentPath === '' || get(hierarchicalVisibilityState(parentPath))) &&
          get(singleVisibilityState(path))
        );
      },
    set:
      (path: string) =>
      ({ get, set }, newVisibility) => {
        if (newVisibility) {
          set(singleVisibilityState(path), true);
          const parentPath = getParentPath(path);
          if (parentPath !== '' && get(hierarchicalVisibilityState(parentPath)) === false) {
            set(hierarchicalVisibilityState(parentPath), true);
          }
        } else {
          set(singleVisibilityState(path), false);
        }
      },
  });

  return hierarchicalVisibilityState;
}
