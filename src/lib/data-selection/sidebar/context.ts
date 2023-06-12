import { createContext, useContext } from 'react';
import { useRecoilState } from 'recoil';

import { RecoilStateFamily } from '@/lib/recoil/types';

export const VisibilityStateContext = createContext<RecoilStateFamily<boolean, string>>(null);

export function useVisibilityState(path: string) {
  const visibilityState = useContext(VisibilityStateContext);

  return useRecoilState(visibilityState(path));
}

export const ExpandedStateContext = createContext<RecoilStateFamily<boolean, string>>(null);

export function useExpandedState(path: string) {
  const expandedState = useContext(ExpandedStateContext);
  return useRecoilState(expandedState(path));
}
