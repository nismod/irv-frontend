import { FC } from 'react';

import { PathChildrenStateContext } from '@/lib/paths/sub-path';
import { RecoilStateFamily } from '@/lib/recoil/types';

import { ExpandedStateContext, VisibilityStateContext } from './context';

export const SidebarRoot: FC<{
  visibilityState: RecoilStateFamily<boolean, string>;
  expandedState: RecoilStateFamily<boolean, string>;
  pathChildrenState: RecoilStateFamily<string[], string>;
}> = ({ visibilityState, expandedState, pathChildrenState, children }) => {
  return (
    <VisibilityStateContext.Provider value={visibilityState}>
      <ExpandedStateContext.Provider value={expandedState}>
        <PathChildrenStateContext.Provider value={pathChildrenState}>
          {children}
        </PathChildrenStateContext.Provider>
      </ExpandedStateContext.Provider>
    </VisibilityStateContext.Provider>
  );
};
