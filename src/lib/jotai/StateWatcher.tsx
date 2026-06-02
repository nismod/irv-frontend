import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

/**
 * A component that watches a Jotai atom and calls a callback with the current value.
 *
 * Observes a single atom and runs a callback when its value changes.
 * Use when you do not need a `{ get, set }` store handle (see `AtomEffectRoot` / `jotai-effect`).
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
