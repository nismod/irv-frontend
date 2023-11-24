import React, { createContext, FC, ReactNode, useContext } from 'react';

const ContentWatcherContext = createContext<ReactNode>(null);

/**
 * Context for the `ContentWatcher` component.
 *
 * When `ContentWatcher` is used inside `ContentWatcherScope`,
 * it will render the element passed to `watcher`.
 */
export const ContentWatcherScope: FC<{
  watcher: ReactNode;
}> = ({ watcher, children }) => {
  return (
    <ContentWatcherContext.Provider value={watcher}>{children}</ContentWatcherContext.Provider>
  );
};

/**
 * Use this component inside a UI section to indicate that this section has some content.
 *
 * The UI section needs to be wrapped with a `ContentWatcherScope`.
 */
export function ContentWatcher() {
  const contentWatcher = useContext(ContentWatcherContext);

  return <>{contentWatcher}</>;
}
