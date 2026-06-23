import { atom } from 'jotai';

export type ViewType = 'hazard' | 'exposure' | 'vulnerability' | 'risk' | 'adaptation';

const INITIAL_VIEW: ViewType = 'hazard';

/** Current map view (route segment `:view`). Synced via `RouteParamSync` in MapPage. */
export const viewAtom = atom<ViewType>(INITIAL_VIEW);
