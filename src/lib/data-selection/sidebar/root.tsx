import { FC, ReactNode } from 'react';

import type { HierarchicalVisibilityAtomFamily } from '@/lib/data-selection/make-hierarchical-visibility-state';
import type { JotaiStateFamily } from '@/lib/jotai/types';
import { PathRoot } from '@/lib/paths/PathRoot';

import {
  ExpandedStateContext,
  HierarchicalVisibilityStateContext,
  VisibilityStateContext,
} from './context';

export const SidebarRoot: FC<{
  visibilityAtomFamily: JotaiStateFamily<boolean, string>;
  hierarchicalVisibilityAtomFamily: HierarchicalVisibilityAtomFamily;
  expandedAtomFamily: JotaiStateFamily<boolean, string>;
  pathChildrenAtomFamily: JotaiStateFamily<string[], string>;
  pathChildrenLoadingAtomFamily: JotaiStateFamily<boolean, string>;
  children?: ReactNode;
}> = ({
  visibilityAtomFamily,
  hierarchicalVisibilityAtomFamily,
  expandedAtomFamily,
  pathChildrenAtomFamily,
  pathChildrenLoadingAtomFamily,
  children,
}) => {
  return (
    <VisibilityStateContext.Provider value={visibilityAtomFamily}>
      <HierarchicalVisibilityStateContext.Provider value={hierarchicalVisibilityAtomFamily}>
        <ExpandedStateContext.Provider value={expandedAtomFamily}>
          <PathRoot
            pathChildrenAtomFamily={pathChildrenAtomFamily}
            pathChildrenLoadingAtomFamily={pathChildrenLoadingAtomFamily}
          >
            {children}
          </PathRoot>
        </ExpandedStateContext.Provider>
      </HierarchicalVisibilityStateContext.Provider>
    </VisibilityStateContext.Provider>
  );
};
