import { FC, ReactNode, useEffect } from 'react';

import { usePath, useSetPathChildren } from './context';
import { PathNode } from './PathNode';
import { makeChildPath } from './utils';

function addValueToArray(val: string) {
  return (arr: string[]) => Array.from(new Set([...arr, val]));
}
function removeValueFromArray(val: string) {
  return (arr: string[]) => [...arr.filter((x) => x !== val)];
}

function useRegisterChild(parentPath: string, subPath: string) {
  const setPathChildren = useSetPathChildren(parentPath);

  useEffect(() => {
    setPathChildren(addValueToArray(subPath));

    return () => {
      setPathChildren(removeValueFromArray(subPath));
    };
  }, [subPath, setPathChildren, parentPath]);
}

export const SubPath: FC<{ path: string; children?: ReactNode }> = ({ path, children }) => {
  const parentPath = usePath();

  useRegisterChild(parentPath, path);

  return <PathNode path={makeChildPath(parentPath, path)}>{children}</PathNode>;
};
