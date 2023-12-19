import { CallbackInterface, TransactionInterface_UNSTABLE } from 'recoil';

type StateEffectAtomicInterface = TransactionInterface_UNSTABLE;

/**
 * Type for a function to be used as a state effect.
 * The function will be called with the Recoil transaction interface (get, set, reset),
 * the current value, and previous value of the tracked state.
 */
export type StateEffect<T> = (ops: StateEffectAtomicInterface, value: T, previousValue: T) => void;

/**
 * Like StateEffect<T> but without the previous value
 */
export type CurrentStateEffect<T> = (ops: StateEffectAtomicInterface, value: T) => void;

type StateEffectAsyncInterface = Pick<CallbackInterface, 'snapshot' | 'set' | 'reset'>;

/**
 * Type for a function to be used as an async state effect.
 * The function will be called with the Recoil async interface (snapshot, set, reset),
 * the current value, and previous value of the tracked state.
 */
export type StateEffectAsync<T> = (
  ops: StateEffectAsyncInterface,
  value: T,
  previousValue: T,
) => void;

/**
 * Like StateEffectAsync<T> but without the previous value
 */
export type CurrentStateEffectASync<T> = (ops: StateEffectAsyncInterface, value: T) => void;

/** React's useEffect or useLayoutEffect */
export type EffectHookType = 'effect' | 'layoutEffect';
