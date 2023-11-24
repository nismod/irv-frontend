import { selector } from 'recoil';

import { ConfigTree } from '@/lib/nested-config/config-tree';
import { flattenConfig } from '@/lib/nested-config/flatten-config';
import { ReadSelectorGetDefinition } from '@/lib/recoil/types';

import { ViewLayer } from '../view-layers';

export function makeViewLayersState({
  key,
  getViewLayers,
}: {
  key: string;
  getViewLayers: ReadSelectorGetDefinition<ConfigTree<ViewLayer>>;
}) {
  const viewLayersNestedState = selector({
    key: `${key}/viewLayersNestedState`,
    get: getViewLayers,
  });

  const viewLayersState = selector<ViewLayer[]>({
    key: `${key}/viewLayersFlatState`,
    get: ({ get }) => flattenConfig(get(viewLayersNestedState)),
  });

  return viewLayersState;
}
