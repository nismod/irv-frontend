import { useRecoilCallback } from 'recoil';

import { RecoilStateFamily } from './types';

/**
 * Returns a callback that allows setting a member of a recoil state family.
 *
 * Unlike Recoil's built-in `useSetRecoilState`, which requires specifying the family param at the `useSetRecoilState` call site,
 * the callback this function returns accepts two arguments: the first is the family parameter, and the second is the value to be set.
 *
 * This way, the family parameter doesn't need to be known ahead of time.
 *
 * @param stateFamily the state (atom/selector) family whose values can be set using the callback returned from this function
 * @returns a callback
 *
 * Example usage:
 * ```
 * const setHoverState = useSetRecoilStateFamily(hoverByInteractionGroupState);
 *
 * // later on, in an event handler...
 * setHoverState('groupA', value);
 *
 * ```
 */
export function useSetRecoilStateFamily<S, P>(stateFamily: RecoilStateFamily<S, P>) {
  return useRecoilCallback(({ set }) => {
    return (groupName: P, value: S) => {
      set(stateFamily(groupName), value);
    };
  });
}
