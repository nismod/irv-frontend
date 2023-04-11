import { RecoilState, RecoilValue, RecoilValueReadOnly } from 'recoil';

import { StateEffect } from './types';
import { useStateEffect, useStateLayoutEffect } from './use-state-effect';

/**
 * A component that wraps a state effect to prevent a parent from being unnecessarily re-rendered
 */
export const StateEffectRoot = <T,>({
  state,
  effect,
}: {
  state: RecoilValueReadOnly<T>;
  effect: StateEffect<T>;
}) => {
  useStateEffect(state, effect);
  return null;
};

/**
 * A component that wraps a state layout effect to prevent a parent from being unnecessarily re-rendered
 */
export const StateLayoutEffectRoot = <T,>({
  state,
  effect,
}: {
  state: RecoilValueReadOnly<T>;
  effect: StateEffect<T>;
}) => {
  useStateLayoutEffect(state, effect);
  return null;
};
