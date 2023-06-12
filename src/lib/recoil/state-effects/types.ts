import { CallbackInterface, TransactionInterface_UNSTABLE } from 'recoil';

export type StateEffectAtomicInterface = TransactionInterface_UNSTABLE;

/**
 * Type for a function to be used as a state effect.
 * The function will be called with the transaction interace,
 * the current value, and previous value of the tracked state.
 */
export type StateEffect<T> = (ops: StateEffectAtomicInterface, value: T, previousValue: T) => void;

/**
 * Like StateEffect<T> but without the previous value
 */
export type CurrentStateEffect<T> = (ops: StateEffectAtomicInterface, value: T) => void;

export type StateEffectAsyncInterface = Pick<CallbackInterface, 'snapshot' | 'set' | 'reset'>;
export type StateEffectAsync<T> = (
  ops: StateEffectAsyncInterface,
  value: T,
  previousValue: T,
) => void;

export type StateLogicCallback<T> = (newValue: T, previousValue: T) => void;

export type EffectHookType = 'effect' | 'layoutEffect';
