import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { atomWithReset, RESET } from 'jotai/utils';

import { isReset } from '@/lib/jotai/is-reset';

import { InteractionTarget } from './types';

/**
 * State family containing an array of hovered targets, per interaction group
 */
export const hoverAtomFamily = atomFamily((_group: string) =>
  atomWithReset<InteractionTarget[]>([]),
);

export type HoverAnchorLngLat = { lng: number; lat: number };

const INITIAL_HOVER_POSITION: HoverAnchorLngLat | null = null;

/**
 * Geographic anchor for the data map tooltip (re-projected to screen on map move).
 */
export const hoverPositionAtom = atom<HoverAnchorLngLat | null>(INITIAL_HOVER_POSITION);

/**
 * State family containing one selected target (or null), per interaction group
 */
export const selectionAtomFamily = atomFamily((_group: string) => {
  const initial: InteractionTarget | null = null;
  return atomWithReset(initial);
});

type AllowedGroupLayers = Record<string, string[]>;

const allowedGroupLayersInternalAtom = atom<AllowedGroupLayers>({});

/**
 * State containing a dictionary with keys being interaction group IDs, and values being arrays of allowed view layer IDs for the given group.
 *
 * When this state is updated, layers that aren't allowed anymore are removed from the hover / selection state.
 */
export const allowedGroupLayersAtom = atom(
  (get) => get(allowedGroupLayersInternalAtom),
  (get, set, newAllowedGroups: AllowedGroupLayers | typeof RESET) => {
    const oldAllowedGroupLayers = get(allowedGroupLayersInternalAtom);
    const shouldReset = isReset(newAllowedGroups);

    for (const group of Object.keys(oldAllowedGroupLayers)) {
      if (shouldReset) {
        set(hoverAtomFamily(group), RESET);
        set(selectionAtomFamily(group), RESET);
      } else {
        const newAllowedLayers = newAllowedGroups[group];

        if (newAllowedLayers == null || newAllowedLayers.length === 0) {
          // if the interaction group is no longer present or has no allowed layers, reset the hover and select state for this group
          set(hoverAtomFamily(group), RESET);
          set(selectionAtomFamily(group), RESET);
        } else {
          // if the interaction group is still present, keep only those hovered/selected layers that are still allowed

          // only leave hover targets if they are from allowed layers
          const oldHoverTargets = get(hoverAtomFamily(group));
          set(hoverAtomFamily(group), filterTargets(oldHoverTargets, newAllowedLayers));

          const oldSelectionTarget = get(selectionAtomFamily(group));
          set(
            selectionAtomFamily(group),
            newAllowedLayers.includes(oldSelectionTarget?.viewLayer.id) ? oldSelectionTarget : null,
          );
        }
      }
    }

    set(allowedGroupLayersInternalAtom, shouldReset ? {} : newAllowedGroups);
  },
);

function filterTargets(
  oldHoverTargets: InteractionTarget[],
  allowedLayers: string[],
): InteractionTarget[] {
  const newLayerFilter = new Set(allowedLayers);
  return oldHoverTargets.filter((target) => newLayerFilter.has(target.viewLayer.id));
}
