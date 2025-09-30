import { createContext, useContext } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { RecoilStateFamily } from '../recoil/types';

export const PathContext = createContext<string>('');

export function usePath() {
  return useContext(PathContext);
}

export const PathChildrenStateContext = createContext<RecoilStateFamily<string[], string> | null>(
  null,
);

export function usePathChildren(path: string) {
  const pathChildrenState = useContext(PathChildrenStateContext);
  return useRecoilValue(pathChildrenState(path));
}

export function useSetPathChildren(path: string) {
  const pathChildrenState = useContext(PathChildrenStateContext);
  return useSetRecoilState(pathChildrenState(path));
}

export const PathChildrenLoadingStateContext =
  createContext<RecoilStateFamily<boolean, string>>(null);

export function usePathChildrenLoading(path: string) {
  const pathChildrenLoadingState = useContext(PathChildrenLoadingStateContext);
  return useRecoilValue(pathChildrenLoadingState(path));
}

export function useSetPathChildrenLoading(path: string) {
  const pathChildrenLoadingState = useContext(PathChildrenLoadingStateContext);
  return useSetRecoilState(pathChildrenLoadingState(path));
}
