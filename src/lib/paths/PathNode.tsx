import { FC, ReactNode, useEffect } from 'react';

import { PathContext, usePath, useSetPathChildrenLoading } from './context';

function PathChildrenStart() {
  const path = usePath();

  const setPathChildrenLoading = useSetPathChildrenLoading(path);

  useEffect(() => {
    setPathChildrenLoading(true);
  });

  return null;
}

function PathChildrenEnd() {
  const path = usePath();

  const setPathChildrenLoading = useSetPathChildrenLoading(path);

  useEffect(() => {
    setPathChildrenLoading(false);
  });

  return null;
}

export const PathNode: FC<{ path: string; children?: ReactNode }> = ({ path, children }) => {
  return (
    <PathContext.Provider value={path}>
      <PathChildrenStart />
      {children}
      <PathChildrenEnd />
    </PathContext.Provider>
  );
};
