import { FC, createContext, useContext, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { RecoilStateFamily } from '../recoil/types';
import { PathContext, getSubPath, usePath } from './paths';

export const PathChildrenStateContext = createContext<RecoilStateFamily<string[], string>>(null);

export function usePathChildrenState(path: string) {
  const pathChildrenState = useContext(PathChildrenStateContext);
  return useRecoilState(pathChildrenState(path));
}

function addValueToArray(val: string) {
  return (arr: string[]) => Array.from(new Set([...arr, val]));
}
function removeValueFromArray(val: string) {
  return (arr: string[]) => [...arr.filter((x) => x !== val)];
}

function useRegisterChild(parentPath: string, subPath: string) {
  const [, setPathChildren] = usePathChildrenState(parentPath);

  useEffect(() => {
    setPathChildren(addValueToArray(subPath));

    return () => {
      setPathChildren(removeValueFromArray(subPath));
    };
  }, [subPath, setPathChildren]);
}

export const SubPath: FC<{ path: string }> = ({ path, children }) => {
  const parentPath = usePath();
  const subPath = getSubPath(parentPath, path);

  useRegisterChild(parentPath, path);
  return <PathContext.Provider value={subPath}>{children}</PathContext.Provider>;
};
