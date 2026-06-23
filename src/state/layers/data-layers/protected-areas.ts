import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { truthyKeys } from '@/lib/helpers';

import { ProtectedAreaType } from '@/config/protected-areas/metadata';
import { protectedAreaViewLayer } from '@/config/protected-areas/protected-area-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { protectedAreaTypeSelectionAtom } from '@/state/data-selection/protected-areas';

export const protectedAreasKeysAtom = atom<ProtectedAreaType[]>((get) =>
  get(sidebarPathVisibilityAtomFamily('vulnerability/nature/protected-areas'))
    ? truthyKeys(get(protectedAreaTypeSelectionAtom))
    : [],
);

export const protectedAreasPointLayerAtom = atom<ViewLayer[]>((get) =>
  get(protectedAreasKeysAtom).map((type) => protectedAreaViewLayer('points', type)),
);

export const protectedAreasPolygonLayerAtom = atom<ViewLayer[]>((get) =>
  get(protectedAreasKeysAtom).map((type) => protectedAreaViewLayer('polygons', type)),
);
