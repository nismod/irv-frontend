import type { Getter, Setter, WritableAtom } from 'jotai';

import { RESET } from '../is-reset';

/**
 * The transaction-like operations available inside a synchronous state effect.
 *
 * Jotai does not have an explicit transaction primitive (Recoil's `transact_UNSTABLE`).
 * The closest equivalent is the `(get, set)` pair produced by `useAtomCallback`, which
 * lets you read the latest store value and synchronously write multiple atoms in one
 * callback — successive `set`s become visible to subsequent `get`s.
 *
 * `reset(atom)` is provided as sugar for `set(atom, RESET)`.
 */
export interface StateEffectInterface {
  get: Getter;
  set: Setter;
  /** Reset a writable atom to its initial value. Only works for atoms that accept RESET. */
  reset: <V, A extends [typeof RESET] | unknown[], R>(atom: WritableAtom<V, A, R>) => void;
}

/**
 * Backwards-compatible alias for the Recoil naming.
 *
 * NOTE: In the Recoil version, "Atomic" referred to the transaction wrapping; in Jotai,
 * every `useAtomCallback` is already "atomic" within a single callback invocation,
 * so the distinction is mostly historical and exists for one-to-one renaming.
 */
export type StateEffectAtomicInterface = StateEffectInterface;

/**
 * In Recoil the async variant exposed `snapshot.getPromise` for async reads. In Jotai,
 * `get(asyncAtom)` returns a Promise from inside a callback automatically, so the async
 * and sync interfaces are unified. This alias is preserved purely to make a one-to-one
 * file/identifier port of the existing effects.
 */
export type StateEffectAsyncInterface = StateEffectInterface;

/**
 * Type for a function to be used as a state effect.
 * The function will be called with the Jotai transaction-like interface (get, set, reset),
 * the current value, and previous value of the watched atom.
 */
export type StateEffect<T> = (ops: StateEffectInterface, value: T, previousValue: T) => void;

/**
 * Like StateEffect<T> but without the previous value.
 */
export type CurrentStateEffect<T> = (ops: StateEffectInterface, value: T) => void;

/**
 * Like StateEffect<T> but for the (formerly) async variant.
 */
export type StateEffectAsync<T> = (
  ops: StateEffectAsyncInterface,
  value: T,
  previousValue: T,
) => void;

/**
 * Like StateEffectAsync<T> but without the previous value.
 */
export type CurrentStateEffectAsync<T> = (ops: StateEffectAsyncInterface, value: T) => void;

/** React's useEffect or useLayoutEffect */
export type EffectHookType = 'effect' | 'layoutEffect';
