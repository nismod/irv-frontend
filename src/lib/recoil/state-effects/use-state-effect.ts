import { useEffect, useLayoutEffect } from 'react';
import {
  RecoilState,
  RecoilValue,
  RecoilValueReadOnly,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';

import { usePrevious } from '@/lib/hooks/use-previous';

import { StateEffect } from './types';

function useStateEffectImpl<T>(state: RecoilValue<T>, effect: StateEffect<T>) {
  const stateValue = useRecoilValue(state);

  const previousStateValue = usePrevious(stateValue);

  const cb = useRecoilCallback(
    ({ transact_UNSTABLE }) =>
      (newValue: T, previousValue: T) => {
        transact_UNSTABLE((ops) => effect(ops, newValue, previousValue));
      },
    [effect],
  );

  return [stateValue, previousStateValue, cb] as const;
}

/**
 * Run a state effect when a piece of state changes.
 * A state effect can modify other pieces of state.
 * @param state the recoil state to watch
 * @param effect the state effect to run when the state changes
 */
export function useStateEffect<T>(state: RecoilValueReadOnly<T>, effect: StateEffect<T>) {
  const [stateValue, previousStateValue, cb] = useStateEffectImpl(state, effect);

  useEffect(() => cb(stateValue, previousStateValue), [cb, stateValue, previousStateValue]);
}

/**
 * Run a state layout effect when a piece of state changes.
 * A state effect can modify other pieces of state.
 * @param state the recoil state to watch
 * @param effect the state effect to run when the state changes
 */
export function useStateLayoutEffect<T>(state: RecoilValueReadOnly<T>, effect: StateEffect<T>) {
  const [stateValue, previousStateValue, cb] = useStateEffectImpl(state, effect);

  useLayoutEffect(() => cb(stateValue, previousStateValue), [cb, stateValue, previousStateValue]);
}
