import type { Atom, WritableAtom } from 'jotai';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

/**
 * Sync an external value to a jotai atom.
 *
 * Whenever `value` changes (and `doSync` is true), `replicaAtom` will be set to that value.
 */
export function useSyncValueToAtom<T>(
  value: T,
  replicaAtom: WritableAtom<unknown, [T], unknown>,
  doSync: boolean = true,
) {
  const setState = useSetAtom(replicaAtom);

  useEffect(() => {
    if (doSync) {
      setState(value);
    }
  }, [doSync, setState, value]);
}

/**
 * Sync one piece of jotai state to another piece of jotai state.
 *
 * Whenever the source atom changes (and `doSync` is true), its current value is written
 * into the replica atom.
 *
 * Direct port of `useSyncState` from `lib/recoil/state-sync/`.
 */
export function useSyncState<T>(
  state: Atom<T>,
  replicaState: WritableAtom<unknown, [T], unknown>,
  doSync: boolean = true,
) {
  const value = useAtomValue(state);

  useSyncValueToAtom(value, replicaState, doSync);
}
