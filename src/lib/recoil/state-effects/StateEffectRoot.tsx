import { RecoilValueReadOnly } from 'recoil';

import { EffectHookType, StateEffect, StateEffectAsync } from './types';
import { useStateEffectAsync, useStateEffectAtomic } from './use-state-effect';

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
