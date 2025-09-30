import { useState } from 'react';

import { ViewLayerStateContext } from './view-layer-state';

export function ViewLayerContextProvider({
  children,
  viewLayer,
}: {
  children: React.ReactNode;
  viewLayer: any;
}) {
  // TODO get view layer state from the central store
  const [state, setState] = useState({});
  return (
    <ViewLayerStateContext.Provider value={[state, setState]}>
      {children}
    </ViewLayerStateContext.Provider>
  );
}
