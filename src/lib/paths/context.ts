import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { createContext, useContext } from 'react';

import type { JotaiStateFamily } from '@/lib/jotai/types';

export const PathContext = createContext<string>('');

export function usePath() {
  return useContext(PathContext);
}

export const PathChildrenStateContext = createContext<JotaiStateFamily<string[], string> | null>(
  null,
);

export function usePathChildren(path: string) {
  const pathChildrenAtomFamily = useContext(PathChildrenStateContext);
  return useAtomValue(pathChildrenAtomFamily!(path));
}

export function usePathChildrenState(path: string) {
  const pathChildrenAtomFamily = useContext(PathChildrenStateContext);
  return useAtom(pathChildrenAtomFamily!(path));
}

export function useSetPathChildren(path: string) {
  const pathChildrenAtomFamily = useContext(PathChildrenStateContext);
  return useSetAtom(pathChildrenAtomFamily!(path));
}

export const PathChildrenLoadingStateContext = createContext<JotaiStateFamily<
  boolean,
  string
> | null>(null);

export function usePathChildrenLoading(path: string) {
  const pathChildrenLoadingAtomFamily = useContext(PathChildrenLoadingStateContext);
  return useAtomValue(pathChildrenLoadingAtomFamily!(path));
}

export function useSetPathChildrenLoading(path: string) {
  const pathChildrenLoadingAtomFamily = useContext(PathChildrenLoadingStateContext);
  return useSetAtom(pathChildrenLoadingAtomFamily!(path));
}
