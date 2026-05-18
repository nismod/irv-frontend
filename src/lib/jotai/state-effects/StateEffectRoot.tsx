import type { Atom } from 'jotai';

import type { EffectHookType, StateEffect, StateEffectAsync } from './types';
import { useStateEffectAsync, useStateEffectAtomic } from './use-state-effect';

/**
 * The root of a state effect. When this component is rendered, the effect will be
 * executed upon every change to the watched atom (using `useAtomCallback` under the hood).
 *
 * Effects are executed in the order in which the effect roots are rendered.
 *
 * Direct port of `StateEffectRoot` from `lib/recoil/state-effects/`.
 */
export const StateEffectRoot = <T,>({
  state,
  effect,
  hookType = 'effect',
}: {
  state: Atom<T>;
  effect: StateEffect<T>;
  hookType?: EffectHookType;
}) => {
  useStateEffectAtomic(state, effect, hookType);

  return null;
};

/**
 * The root of an "async" state effect. In Jotai there is no separate transaction layer,
 * so this behaves identically to `StateEffectRoot`. The component is kept for naming
 * parity with the Recoil version, making the migration of consumers a pure rename.
 */
export const StateEffectRootAsync = <T,>({
  state,
  effect,
  hookType = 'effect',
}: {
  state: Atom<T>;
  effect: StateEffectAsync<T>;
  hookType?: EffectHookType;
}) => {
  useStateEffectAsync(state, effect, hookType);

  return null;
};
