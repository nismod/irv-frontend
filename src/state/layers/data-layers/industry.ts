import { atom } from 'jotai';

import { ViewLayer } from '@/lib/data-map/view-layers';
import { truthyKeys } from '@/lib/helpers';

import { industryViewLayer } from '@/config/industry/industry-view-layer';
import { sidebarPathVisibilityAtomFamily } from '@/sidebar/sidebar-state';
import { industrySelectionAtom } from '@/state/data-selection/industry';

export const industryLayersAtom = atom<ViewLayer[]>((get) =>
  get(sidebarPathVisibilityAtomFamily('exposure/industry'))
    ? truthyKeys(get(industrySelectionAtom)).map((industryType) => industryViewLayer(industryType))
    : [],
);
