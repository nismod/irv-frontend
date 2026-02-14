import { createContext, useContext } from 'react';

export type ViewLayerStateContextValue<StateT> = [
  state: StateT,
  setState: (valOrUpdater: StateT | ((prevState: StateT) => StateT)) => void,
];

export const ViewLayerStateContext = createContext<ViewLayerStateContextValue<any>>(undefined);

export function useViewLayerState<StateT>() {
  const context = useContext<ViewLayerStateContextValue<StateT>>(ViewLayerStateContext);
  if (context === undefined) {
    throw new Error('useViewLayerState must be used within a ViewLayerStateProvider');
  }
  return context;
}
