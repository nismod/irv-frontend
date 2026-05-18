import type { Atom, WritableAtom } from 'jotai';

import { useSyncState } from './use-sync-state';

/**
 * A mount-only component that keeps a replica atom synchronized with a source atom.
 *
 * Direct port of `StateSyncRoot` from `lib/recoil/state-sync/`.
 */
export function StateSyncRoot<T>({
  state,
  replicaState,
  doSync = true,
}: {
  state: Atom<T>;
  replicaState: WritableAtom<unknown, [T], unknown>;
  doSync?: boolean;
}) {
  useSyncState(state, replicaState, doSync);
  return null;
}
