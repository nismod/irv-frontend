import { atom } from 'recoil';

export type MapInteractionMode = 'standard' | 'pixel-driller';

export const mapInteractionModeState = atom<MapInteractionMode>({
  key: 'mapInteractionMode',
  default: 'standard',
});

export const pixelDrillerClickLocationState = atom<{ lng: number; lat: number } | null>({
  key: 'pixelDrillerClickLocation',
  default: null,
});
