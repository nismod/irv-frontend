import { useEffect, useLayoutEffect } from 'react';
import { RecoilValueReadOnly, useRecoilCallback, useRecoilValue } from 'recoil';

import { useConditionalHook } from '@/lib/hooks/use-conditional-hook';
import { usePrevious } from '@/lib/hooks/use-previous';

import { EffectHookType, StateEffect, StateEffectAsync, StateLogicCallback } from './types';

export function useStateLogicAtomicCallback<T>(effect: StateEffect<T>) {
  return useRecoilCallback(
    ({ transact_UNSTABLE }) =>
      (newValue: T, previousValue: T) => {
        transact_UNSTABLE((ops) => effect(ops, newValue, previousValue));
      },
    [effect],
  );
}

export function useStateLogicAsyncCallback<T>(effect: StateEffectAsync<T>) {
  return useRecoilCallback(
    (ops) => (newValue: T, previousValue: T) => effect(ops, newValue, previousValue),
    [effect],
  );
}

export function useStateEffect<T>(
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

export function useStateEffectAtomic<T>(
  state: RecoilValueReadOnly<T>,
  effect: StateEffect<T>,
  hookType: EffectHookType = 'effect',
) {
  const cb = useStateLogicAtomicCallback(effect);

  useStateEffect(state, cb, hookType);
}

export function useStateEffectAsync<T>(
  state: RecoilValueReadOnly<T>,
  effect: StateEffectAsync<T>,
  hookType: EffectHookType = 'layoutEffect',
) {
  const cb = useStateLogicAsyncCallback(effect);

  useStateEffect(state, cb, hookType);
}
