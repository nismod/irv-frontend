import { RecoilState, RecoilValueReadOnly } from 'recoil';

import { useSyncState } from './use-sync-state';

export function StateSyncRoot<T>({
  state,
  replicaState,
  doSync = true,
}: {
  state: RecoilValueReadOnly<T>;
  replicaState: RecoilState<T>;
  doSync?: boolean;
}) {
  useSyncState(state, replicaState, doSync);
  return null;
}
