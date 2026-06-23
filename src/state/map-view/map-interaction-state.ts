import { atom } from 'jotai';

export type MapInteractionMode = 'standard' | 'pixel-driller';

export const mapInteractionModeAtom = atom<MapInteractionMode>('standard');

// Note: bind the `null` initial value to a typed variable to avoid Jotai's
// `atom(value)` overload being resolved as the read-only `atom(readFn)` form.
const INITIAL_PIXEL_DRILLER_CLICK_LOCATION: { lng: number; lat: number } | null = null;
export const pixelDrillerClickLocationAtom = atom(INITIAL_PIXEL_DRILLER_CLICK_LOCATION);
