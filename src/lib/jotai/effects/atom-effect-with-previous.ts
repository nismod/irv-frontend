import type { Atom } from 'jotai';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

import type { StateEffectInterface } from '@/lib/jotai/state-effects/types';

export type StateEffectWithPrevious<T> = (
  ops: StateEffectInterface,
  value: T,
  previousValue: T | undefined,
) => void | (() => void);

/**
 * Jotai effect atom that runs `effect` when `sourceAtom` changes.
 * `previousValue` is undefined on the first run, then the prior value of `sourceAtom`.
 *
 * Previous value is stored in a hidden atom (per Jotai store), so the same effect atom
 * can be subscribed from multiple stores without cross-talk. `get.peek` avoids treating
 * previous as a dependency and re-running when it is updated.
 */
export function atomEffectWithPrevious<T>(sourceAtom: Atom<T>, effect: StateEffectWithPrevious<T>) {
  const previousAtom = atom(undefined as T | undefined, (_get, _set, next: T | undefined) => next);

  return atomEffect((get, set) => {
    const value = get(sourceAtom);
    const previousValue = get.peek(previousAtom);

    if (Object.is(value, previousValue)) {
      return;
    }

    const cleanup = effect({ get, set }, value, previousValue);

    set(previousAtom, value);
    return cleanup;
  });
}
