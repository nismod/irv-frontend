import { useEffect, useLayoutEffect } from 'react';
import { RecoilValueReadOnly, useRecoilCallback, useRecoilValue } from 'recoil';

import { useConditionalHook } from '@/lib/hooks/use-conditional-hook';
import { usePrevious } from '@/lib/hooks/use-previous';

import { EffectHookType, StateEffect, StateEffectAsync } from './types';

type StateLogicCallback<T> = (newValue: T, previousValue: T) => void;

function useStateLogicAtomicCallback<T>(effect: StateEffect<T>) {
  return useRecoilCallback(
    ({ transact_UNSTABLE }) =>
      (newValue: T, previousValue: T) => {
        transact_UNSTABLE((ops) => effect(ops, newValue, previousValue));
      },
    [effect],
  );
}

function useStateLogicAsyncCallback<T>(effect: StateEffectAsync<T>) {
  return useRecoilCallback(
    (ops) => (newValue: T, previousValue: T) => effect(ops, newValue, previousValue),
    [effect],
  );
}

function useStateEffect<T>(
  state: RecoilValueReadOnly<T>,
  stateLogicCallback: StateLogicCallback<T>,
  hookType: EffectHookType,
) {
  const stateValue = useRecoilValue(state);
  const previousStateValue = usePrevious(stateValue);

  const useSomeEffect = useConditionalHook(hookType === 'effect', useEffect, useLayoutEffect);
  useSomeEffect(
    () => stateLogicCallback(stateValue, previousStateValue),
    [stateLogicCallback, stateValue, previousStateValue],
  );
}

/**
 * Watch a Recoil state and execute a state effect (atomically - inside a transaction) when the state changes.
 */
export function useStateEffectAtomic<T>(
  /** State to watch */
  state: RecoilValueReadOnly<T>,
  /** Effect to apply upon change */
  effect: StateEffect<T>,
  /** Whether to use useEffect or useLayoutEffect hook */
  hookType: EffectHookType = 'effect',
) {
  const cb = useStateLogicAtomicCallback(effect);

  useStateEffect(state, cb, hookType);
}

/**
 * Watch a Recoil state and execute a state effect (asynchronously - inside `useRecoilCallback`) when the state changes.
 */
export function useStateEffectAsync<T>(
  /** State to watch */
  state: RecoilValueReadOnly<T>,
  /** Effect to apply upon change */
  effect: StateEffectAsync<T>,
  /** Whether to use useEffect or useLayoutEffect hook */
  hookType: EffectHookType = 'effect',
) {
  const cb = useStateLogicAsyncCallback(effect);

  useStateEffect(state, cb, hookType);
}
