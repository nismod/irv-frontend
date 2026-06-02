import type { Atom, WritableAtom } from 'jotai';
import { atom } from 'jotai';
import { RESET } from 'jotai/utils';

function firstElem<T>(options: T[]) {
  return options?.[0];
}

export type DefaultFunction<T> = (options: T[]) => T;

/**
 * Writable derived atom that tracks a user selection against a dynamic options list.
 *
 * Reads the selected value when it is still in `optionsAtom`; otherwise falls back to
 * `defaultFn(options)` (defaults to the first option). Write `RESET` to reset the selected value to null.
 */
export function makeSelectAtom<T>(
  optionsAtom: Atom<T[]>,
  defaultFn: DefaultFunction<T> = firstElem,
): WritableAtom<T, [T | null | typeof RESET], void> {
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
      if (newValue === RESET) {
        set(selectedImpl, null);
      } else {
        set(selectedImpl, newValue);
      }
    },
  );
}
