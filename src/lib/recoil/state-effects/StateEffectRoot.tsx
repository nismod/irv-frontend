import { RecoilValueReadOnly } from 'recoil';

import { EffectHookType, StateEffect, StateEffectAsync } from './types';
import { useStateEffectAsync, useStateEffectAtomic } from './use-state-effect';

/**
 * The root of a state effect. When this component is rendered, the effect will
 * be executed (atomically) upon every change to the state.
 *
 * Effects are executed in the order in which the effect roots are rendered.
 */
export const StateEffectRoot = <T,>({
  state,
  effect,
  hookType = 'effect',
}: {
  state: RecoilValueReadOnly<T>;
  effect: StateEffect<T>;
  hookType?: EffectHookType;
}) => {
  useStateEffectAtomic(state, effect, hookType);

  return null;
};

/**
 * The root of an async state effect. When this component is rendered, the
 * effect will be executed (asynchronously) upon every change to the state.
 *
 * Effects are executed in the order in which the effect roots are rendered.
 */
export const StateEffectRootAsync = <T,>({
  state,
  effect,
  hookType = 'effect',
}: {
  state: RecoilValueReadOnly<T>;
  effect: StateEffectAsync<T>;
  hookType?: EffectHookType;
}) => {
  useStateEffectAsync(state, effect, hookType);

  return null;
};
