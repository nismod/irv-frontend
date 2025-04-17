import { FC, ReactNode } from 'react';

import { RecoilStateFamily } from '../recoil/types';
import { PathChildrenLoadingStateContext, PathChildrenStateContext } from './context';
import { PathNode } from './PathNode';

export const PathRoot: FC<{
  pathChildrenState: RecoilStateFamily<string[], string>;
  pathChildrenLoadingState: RecoilStateFamily<boolean, string>;
  children?: ReactNode;
}> = ({ pathChildrenState, pathChildrenLoadingState, children }) => {
  return (
    <PathChildrenStateContext.Provider value={pathChildrenState}>
      <PathChildrenLoadingStateContext.Provider value={pathChildrenLoadingState}>
        <PathNode path="">{children}</PathNode>
      </PathChildrenLoadingStateContext.Provider>
    </PathChildrenStateContext.Provider>
  );
};
