import { atom as jotaiAtom } from 'jotai';
import { atom } from 'recoil';

import { ViewLayer } from '@/lib/data-map/view-layers';

import { regionalExposureLayer } from '@/config/regional-risk/regional-risk-layer';
import { regionalExposureVariableAtom } from '@/sidebar/sections/risk/regional-risk';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';

export const regionalExposureLayerAtom = jotaiAtom((get): ViewLayer | false => {
  if (!get(sidebarPathVisibilityAtomFamily('risk/regional'))) return false;

  return regionalExposureLayer(get(regionalExposureVariableAtom));
});

/** Recoil passthrough for `viewLayersState`; fed by `ViewLayersBridgeSync` from `regionalExposureLayerAtom`. */
export const regionalExposureLayerState = atom<ViewLayer | false>({
  key: 'regionalExposureLayerState',
  default: false,
});
