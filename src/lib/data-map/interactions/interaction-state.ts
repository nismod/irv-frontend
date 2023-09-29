import { atom, atomFamily, selector } from 'recoil';

import { isReset } from '@/lib/recoil/is-reset';

import { InteractionTarget } from './types';

/**
 * State family containing an array of hovered targets, per interaction group
 */
export const hoverState = atomFamily<InteractionTarget[], string>({
  key: 'hoverState',
  default: [],
});

/**
 * State containing last hover position (cursor position)
 */
export const hoverPositionState = atom<[x: number, y: number]>({
  key: 'hoverPosition',
  default: null,
});

/**
 * State family containing one selected target (or null), per interaction group
 */
export const selectionState = atomFamily<InteractionTarget, string>({
  key: 'selectionState',
  default: null,
});

type AllowedGroupLayers = Record<string, string[]>;

const allowedGroupLayersInternal = atom<AllowedGroupLayers>({
  key: 'allowedGroupLayersInternal',
  default: {},
});

/**
 * State containing a dictionary with keys being interaction group IDs, and values being arrays of allowed view layer IDs for the given group.
 *
 * When this state is updated, layers that aren't allowed anymore are removed from the hover / selection state.
 */
export const allowedGroupLayersState = selector<AllowedGroupLayers>({
  key: 'allowedGroupLayersState',
  get: ({ get }) => get(allowedGroupLayersInternal),
  set: ({ get, set, reset }, newAllowedGroups) => {
    const oldAllowedGroupLayers = get(allowedGroupLayersInternal);
    const shouldReset = isReset(newAllowedGroups);

    for (const group of Object.keys(oldAllowedGroupLayers)) {
      if (shouldReset) {
        reset(hoverState(group));
        reset(selectionState(group));
      } else {
        const newAllowedLayers = newAllowedGroups[group];

        if (newAllowedLayers == null || newAllowedLayers.length === 0) {
          // if the interaction group is no longer present or has no allowed layers, reset the hover and select state for this group
          reset(hoverState(group));
          reset(selectionState(group));
        } else {
          // if the interaction group is still present, keep only those hovered/selected layers that are still allowed

          // only leave hover targets if they are from allowed layers
          const oldHoverTargets = get(hoverState(group));
          set(hoverState(group), filterTargets(oldHoverTargets, newAllowedLayers));

          // only leave selection target if it is from an allowed layer
          const oldSelectionTarget = get(selectionState(group));
          set(
            selectionState(group),
            newAllowedLayers.includes(oldSelectionTarget?.viewLayer.id) ? oldSelectionTarget : null,
          );
        }
      }
    }

    set(allowedGroupLayersInternal, newAllowedGroups);
  },
});

function filterTargets(
  oldHoverTargets: InteractionTarget[],
  allowedLayers: string[],
): InteractionTarget[] {
  const newLayerFilter = new Set(allowedLayers);
  return oldHoverTargets.filter((target) => newLayerFilter.has(target.viewLayer.id));
}
