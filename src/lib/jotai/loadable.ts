import type { Atom } from 'jotai';
import { atom } from 'jotai';
import { unwrap } from 'jotai/utils';

export type Loadable<Value> =
  | { state: 'loading' }
  | { state: 'hasError'; error: unknown }
  | { state: 'hasData'; data: Awaited<Value> };

const LOADING = Symbol('loadable-loading');

/**
 * Userland replacement for Jotai's deprecated `loadable` from `jotai/utils`.
 *
 * Wraps `unwrap` so reads return `{ state: 'loading' | 'hasData' | 'hasError' }`
 * instead of suspending. Matches the shape of the deprecated built-in.
 */
export function loadable<Value>(anAtom: Atom<Value>): Atom<Loadable<Value>> {
  const unwrappedAtom = unwrap(anAtom, () => LOADING);
  return atom((get): Loadable<Value> => {
    try {
      const data = get(unwrappedAtom);
      if (typeof data === 'symbol') {
        return { state: 'loading' };
      }
      return { state: 'hasData', data };
    } catch (error) {
      return { state: 'hasError', error };
    }
  });
}
