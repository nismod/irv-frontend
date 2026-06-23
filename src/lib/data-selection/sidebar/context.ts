import { useAtom } from 'jotai';
import { createContext, useContext } from 'react';

import type { HierarchicalVisibilityAtomFamily } from '@/lib/data-selection/make-hierarchical-visibility-state';
import type { JotaiStateFamily } from '@/lib/jotai/types';

export const VisibilityStateContext = createContext<JotaiStateFamily<boolean, string> | null>(null);

export function useVisibilityState(path: string) {
  const visibilityState = useContext(VisibilityStateContext);
  return useAtom(visibilityState!(path));
}

export const HierarchicalVisibilityStateContext =
  createContext<HierarchicalVisibilityAtomFamily | null>(null);

export function useHierarchicalVisibilityState(path: string) {
  const visibilityState = useContext(HierarchicalVisibilityStateContext);
  return useAtom(visibilityState!(path));
}

export const ExpandedStateContext = createContext<JotaiStateFamily<boolean, string> | null>(null);

export function useExpandedState(path: string) {
  const expandedState = useContext(ExpandedStateContext);
  return useAtom(expandedState!(path));
}
