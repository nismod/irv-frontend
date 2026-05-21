import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { useCallback, useEffect, useLayoutEffect } from 'react';

import { useConditionalHook } from '@/lib/hooks/use-conditional-hook';
import { usePrevious } from '@/lib/hooks/use-previous';

import type { EffectHookType, StateEffect, StateEffectAsync } from './types';

type StateLogicCallback<T> = (newValue: T, previousValue: T) => void;

function useStateLogicAtomicCallback<T>(effect: StateEffect<T>) {
  return useAtomCallback(
    useCallback(
      (get, set, newValue: T, previousValue: T) => {
        effect({ get, set }, newValue, previousValue);
      },
      [effect],
    ),
  );
}

function useStateLogicAsyncCallback<T>(effect: StateEffectAsync<T>) {
  return useAtomCallback(
    useCallback(
      (get, set, newValue: T, previousValue: T) => {
        effect({ get, set }, newValue, previousValue);
      },
      [effect],
    ),
  );
}

function useStateEffect<T>(
  state: Atom<T>,
  stateLogicCallback: StateLogicCallback<T>,
  hookType: EffectHookType,
) {
  const stateValue = useAtomValue(state);
  const previousStateValue = usePrevious(stateValue);

  const useSomeEffect = useConditionalHook(hookType === 'effect', useEffect, useLayoutEffect);
  useSomeEffect(
    () => stateLogicCallback(stateValue, previousStateValue),
    [stateLogicCallback, stateValue, previousStateValue],
  );
}

/**
 * Watch a jotai atom and execute a state effect (synchronously, via `useAtomCallback`)
 * when the atom's value changes.
 *
 * In the Recoil version this was distinct from the "async" variant because it used
 * `transact_UNSTABLE`. In Jotai there is no separate transaction layer — every callback
 * is already free to read and write multiple atoms — but we keep the same name for a
 * smooth one-to-one port. Effects fire after React commits, like Recoil's.
 */
export function useStateEffectAtomic<T>(
  /** Atom to watch */
  state: Atom<T>,
  /** Effect to apply upon change */
  effect: StateEffect<T>,
  /** Whether to use useEffect or useLayoutEffect */
  hookType: EffectHookType = 'effect',
) {
  const cb = useStateLogicAtomicCallback(effect);

  useStateEffect(state, cb, hookType);
}

/**
 * Watch a jotai atom and execute a state effect (via `useAtomCallback`) when the
 * atom's value changes. The "async" variant of the helper, preserved for naming parity
 * with the Recoil version — the implementation is identical to the atomic one in Jotai
 * because there is no separate snapshot/transaction model.
 */
export function useStateEffectAsync<T>(
  /** Atom to watch */
  state: Atom<T>,
  /** Effect to apply upon change */
  effect: StateEffectAsync<T>,
  /** Whether to use useEffect or useLayoutEffect */
  hookType: EffectHookType = 'effect',
) {
  const cb = useStateLogicAsyncCallback(effect);

  useStateEffect(state, cb, hookType);
}
