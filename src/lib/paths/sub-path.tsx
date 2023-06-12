import { FC, createContext, useContext, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { RecoilStateFamily } from '../recoil/types';
import { PathContext, getSubPath, usePath } from './paths';

interface PathChildrenStateContextValue {
  childrenState: RecoilStateFamily<string[], string>;
  childrenLoadingState: RecoilStateFamily<boolean, string>;
}

export const PathChildrenStateContext = createContext<PathChildrenStateContextValue>(null);

export function usePathChildrenState(path: string) {
  const pathChildrenState = useContext(PathChildrenStateContext).childrenState;
  return useRecoilState(pathChildrenState(path));
}

function addValueToArray(val: string) {
  return (arr: string[]) => Array.from(new Set([...arr, val]));
}
function removeValueFromArray(val: string) {
  return (arr: string[]) => [...arr.filter((x) => x !== val)];
}

function useRegisterChild(parentPath: string, subPath: string) {
  const pathChildrenState = useContext(PathChildrenStateContext).childrenState;
  const setPathChildren = useSetRecoilState(pathChildrenState(parentPath));

  useEffect(() => {
    setPathChildren(addValueToArray(subPath));

    return () => {
      setPathChildren(removeValueFromArray(subPath));
    };
  }, [subPath, setPathChildren, parentPath]);
}

export function PathChildrenStart() {
  const path = usePath();

  const pathChildrenLoadingState = useContext(PathChildrenStateContext).childrenLoadingState;
  const setPathChildrenLoading = useSetRecoilState(pathChildrenLoadingState(path));

  useEffect(() => {
    setPathChildrenLoading(true);
  });

  return null;
}

export function PathChildrenEnd() {
  const path = usePath();

  const pathChildrenLoadingState = useContext(PathChildrenStateContext).childrenLoadingState;
  const setPathChildrenLoading = useSetRecoilState(pathChildrenLoadingState(path));

  useEffect(() => {
    setPathChildrenLoading(false);
  });

  return null;
}

export const SubPath: FC<{ path: string }> = ({ path, children }) => {
  const parentPath = usePath();
  const subPath = getSubPath(parentPath, path);

  useRegisterChild(parentPath, path);
  return (
    <PathContext.Provider value={subPath}>
      <PathChildrenStart />
      {children}
      <PathChildrenEnd />
    </PathContext.Provider>
  );
};
