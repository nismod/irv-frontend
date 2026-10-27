import equal from 'fast-deep-equal';
import { atomFamily } from 'jotai-family';
import { selectAtom } from 'jotai/utils';

import {
  hoverAtomFamily,
  selectionAtomFamily,
} from '@/lib/data-map/interactions/interaction-state';
import { makeViewLayerParamsAtom } from '@/lib/data-map/state/make-view-layer-params-atom';
import type { Getter } from '@/lib/data-map/state/make-view-layer-params-atom';
import { IrvViewLayerParams, ViewLayer } from '@/lib/data-map/view-layers';

import { viewLayersAtom } from './view-layers';

// Pointer motion can replace hover targets without changing their feature IDs.
// Keep those updates out of map layer construction.
const hoveredFeatureIdsAtomFamily = atomFamily((group: string) =>
  selectAtom(
    hoverAtomFamily(group),
    (targets): Record<string, string | number | undefined> =>
      Object.fromEntries(
        targets.map(({ viewLayer, target }) => [
          viewLayer.id,
          target.feature?.id ?? target.feature?.properties?.id,
        ]),
      ),
    equal,
  ),
);

export const viewLayersParamsAtom = makeViewLayerParamsAtom<IrvViewLayerParams>({
  viewLayersAtom,
  getParamsForViewLayer: (viewLayer: ViewLayer) => (get: Getter) => ({
    selection: getSelectionParam(get, viewLayer),
    hoveredFeatureId: getHoveredFeatureId(get, viewLayer),
  }),
});

function getHoveredFeatureId(get: Getter, viewLayer: ViewLayer) {
  if (viewLayer.interactionGroup == null) return undefined;

  return get(hoveredFeatureIdsAtomFamily(viewLayer.interactionGroup))[viewLayer.id];
}

function getSelectionParam(get: Getter, viewLayer: ViewLayer) {
  const interactionGroup = viewLayer.interactionGroup;
  if (interactionGroup == null) return null;

  const groupSelection = get(selectionAtomFamily(interactionGroup));

  return groupSelection?.viewLayer.id === viewLayer.id ? groupSelection : null;
}
