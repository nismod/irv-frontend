import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

/**
 * A component that watches a Jotai atom and calls a callback with the current value.
 *
 * Simpler alternative to `StateEffectRoot` when you only need to observe a single atom
 * and do not need access to a transaction-style get/set context.
 *
 * Direct port of the equivalent Recoil helper.
 */
export function StateWatcher<T>({
  state,
  onValue,
}: {
  state: Atom<T>;
  onValue: (value: T) => void;
}) {
  const value = useAtomValue(state);

  useEffect(() => {
    onValue(value);
  }, [onValue, value]);

  return null;
}
