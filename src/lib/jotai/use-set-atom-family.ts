import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';

import type { JotaiStateFamily } from './types';

/**
 * Returns a callback that allows setting a member of a jotai atom family.
 *
 * Unlike Jotai's built-in `useSetAtom`, which requires specifying the family parameter at the
 * `useSetAtom` call site, the callback this function returns accepts two arguments: the first
 * is the family parameter, and the second is the value to be set.
 *
 * This way, the family parameter doesn't need to be known ahead of time.
 *
 * Direct port of `useSetRecoilStateFamily` from `lib/recoil/`.
 *
 * @param stateFamily the atom family whose values can be set using the callback returned from this function
 * @returns a stable callback
 *
 * Example usage:
 * ```
 * const setHoverState = useSetAtomFamily(hoverByInteractionGroupAtomFamily);
 *
 * // later on, in an event handler...
 * setHoverState('groupA', value);
 * ```
 */
export function useSetAtomFamily<S, P>(stateFamily: JotaiStateFamily<S, P>) {
  return useAtomCallback(
    useCallback(
      (_get, set, groupName: P, value: S) => {
        set(stateFamily(groupName), value);
      },
      [stateFamily],
    ),
  );
}
