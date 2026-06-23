import { FC, ReactNode } from 'react';

import type { JotaiStateFamily } from '@/lib/jotai/types';

import { PathChildrenLoadingStateContext, PathChildrenStateContext } from './context';
import { PathNode } from './PathNode';

export const PathRoot: FC<{
  pathChildrenAtomFamily: JotaiStateFamily<string[], string>;
  pathChildrenLoadingAtomFamily: JotaiStateFamily<boolean, string>;
  children?: ReactNode;
}> = ({ pathChildrenAtomFamily, pathChildrenLoadingAtomFamily, children }) => {
  return (
    <PathChildrenStateContext.Provider value={pathChildrenAtomFamily}>
      <PathChildrenLoadingStateContext.Provider value={pathChildrenLoadingAtomFamily}>
        <PathNode path="">{children}</PathNode>
      </PathChildrenLoadingStateContext.Provider>
    </PathChildrenStateContext.Provider>
  );
};
