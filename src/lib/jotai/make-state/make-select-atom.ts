import type { Atom, WritableAtom } from 'jotai';
import { atom } from 'jotai';

import { isReset, RESET } from '../is-reset';

function firstElem<T>(options: T[]) {
  return options?.[0];
}

export type DefaultFunction<T> = (options: T[]) => T;

/**
 * Creates a compound jotai atom that selects from a list of options.
 *
 * Returns a writable derived atom whose value is:
 * - the user-selected option, if it's still in the options list, or
 * - the default option (derived from the options list via `defaultFn`), otherwise.
 *
 * Writing the returned atom updates the user selection. Passing `RESET` (re-exported
 * from `jotai/utils` via `@/lib/jotai/is-reset`) clears the selection so the default is used again.
 *
 * Direct port of `makeSelectState` from `lib/recoil/make-state/`.
 *
 * @param optionsAtom an atom whose value is the list of available options
 * @param defaultFn function to pick the default option from the list (defaults to `firstElem`)
 *
 * NOTE: Unlike the Recoil version this no longer accepts a string `key`. Jotai atoms
 *       don't carry keys; if you need a stable debug label, set `result.debugLabel = '...'`
 *       on the returned atom.
 */
export function makeSelectAtom<T>(
  optionsAtom: Atom<T[]>,
  defaultFn: DefaultFunction<T> = firstElem,
): WritableAtom<T, [T | null | typeof RESET], void> {
  // NOTE: declaring `initial` separately disambiguates Jotai's `atom()` overloads —
  // when the value is literal `null` plus a free generic, TS sometimes picks the
  // read-only overload (`atom(read: Read<Value>) => Atom<Value>`) and the resulting
  // atom is not considered writable.
  const initial: T | null = null;
  const selectedImpl = atom(initial);

  return atom<T, [T | null | typeof RESET], void>(
    (get): T => {
      const selectedOption = get(selectedImpl);
      const options = get(optionsAtom);
      if (selectedOption == null || !options.includes(selectedOption)) {
        return defaultFn(options);
      }
      return selectedOption;
    },
    (_get, set, newValue): void => {
      if (isReset(newValue)) {
        set(selectedImpl, null);
      } else {
        set(selectedImpl, newValue);
      }
    },
  );
}
