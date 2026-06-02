import { useAtomCallback } from 'jotai/utils';
import { FC, ReactNode, useCallback, useContext, useLayoutEffect } from 'react';

import { PathChildrenStateContext, usePath } from './context';
import { PathNode } from './PathNode';
import { makeChildPath } from './utils';

function addValueToArray(val: string) {
  return (arr: string[]) => Array.from(new Set([...arr, val]));
}
function removeValueFromArray(val: string) {
  return (arr: string[]) => [...arr.filter((x) => x !== val)];
}

function useRegisterChild(parentPath: string, subPath: string) {
  const pathChildrenAtomFamily = useContext(PathChildrenStateContext)!;

  const register = useAtomCallback(
    useCallback(
      (get, set, shouldAdd: boolean) => {
        const current = get(pathChildrenAtomFamily(parentPath));
        set(
          pathChildrenAtomFamily(parentPath),
          shouldAdd ? addValueToArray(subPath)(current) : removeValueFromArray(subPath)(current),
        );
      },
      [parentPath, subPath, pathChildrenAtomFamily],
    ),
  );

  useLayoutEffect(() => {
    register(true);

    return () => {
      register(false);
    };
  }, [register]);
}

export const SubPath: FC<{ path: string; children?: ReactNode }> = ({ path, children }) => {
  const parentPath = usePath();

  useRegisterChild(parentPath, path);

  return <PathNode path={makeChildPath(parentPath, path)}>{children}</PathNode>;
};
