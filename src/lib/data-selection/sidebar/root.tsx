import { FC } from 'react';

import { useObjectMemo } from '@/lib/hooks/use-object-memo';
import { PathContext } from '@/lib/paths/paths';
import { PathChildrenEnd, PathChildrenStart, PathChildrenStateContext } from '@/lib/paths/sub-path';
import { RecoilStateFamily } from '@/lib/recoil/types';

import { ExpandedStateContext, VisibilityStateContext } from './context';

export const SidebarRoot: FC<{
  visibilityState: RecoilStateFamily<boolean, string>;
  expandedState: RecoilStateFamily<boolean, string>;
  pathChildrenState: RecoilStateFamily<string[], string>;
  pathChildrenLoadingState: RecoilStateFamily<boolean, string>;
}> = ({
  visibilityState,
  expandedState,
  pathChildrenState,
  pathChildrenLoadingState,
  children,
}) => {
  const pathChildrenContextValue = useObjectMemo({
    childrenState: pathChildrenState,
    childrenLoadingState: pathChildrenLoadingState,
  });
  return (
    <PathContext.Provider value="">
      <VisibilityStateContext.Provider value={visibilityState}>
        <ExpandedStateContext.Provider value={expandedState}>
          <PathChildrenStateContext.Provider value={pathChildrenContextValue}>
            <PathChildrenStart />
            {children}
            <PathChildrenEnd />
          </PathChildrenStateContext.Provider>
        </ExpandedStateContext.Provider>
      </VisibilityStateContext.Provider>
    </PathContext.Provider>
  );
};
