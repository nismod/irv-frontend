import type { Getter, Setter } from 'jotai';

/**
 * Store read/write handle passed to imperative sync helpers and jotai-effect callbacks.
 *
 * To reset an atom, use `set(atom, RESET)` with `RESET` from `@/lib/jotai/is-reset`.
 */
export interface StateEffectInterface {
  get: Getter;
  set: Setter;
}
