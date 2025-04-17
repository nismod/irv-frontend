import { FC, ReactNode } from 'react';

import { PathRoot } from '@/lib/paths/PathRoot';
import { RecoilStateFamily } from '@/lib/recoil/types';

import { ExpandedStateContext, VisibilityStateContext } from './context';

export const SidebarRoot: FC<{
  visibilityState: RecoilStateFamily<boolean, string>;
  expandedState: RecoilStateFamily<boolean, string>;
  pathChildrenState: RecoilStateFamily<string[], string>;
  pathChildrenLoadingState: RecoilStateFamily<boolean, string>;
  children?: ReactNode;
}> = ({
  visibilityState,
  expandedState,
  pathChildrenState,
  pathChildrenLoadingState,
  children,
}) => {
  return (
    <VisibilityStateContext.Provider value={visibilityState}>
      <ExpandedStateContext.Provider value={expandedState}>
        <PathRoot
          pathChildrenState={pathChildrenState}
          pathChildrenLoadingState={pathChildrenLoadingState}
        >
          {children}
        </PathRoot>
      </ExpandedStateContext.Provider>
    </VisibilityStateContext.Provider>
  );
};
