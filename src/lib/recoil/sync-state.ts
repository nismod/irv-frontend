import { useEffect } from 'react';
import { RecoilState, RecoilValueReadOnly, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * Sync an external value to a recoil state
 */
export function useSyncRecoilState<T>(state: RecoilState<T>, value: T) {
  const setState = useSetRecoilState(state);

  useEffect(() => setState(value), [setState, value]);
}

/**
 * Sync one piece of recoil state to another piece of recoil state
 */
export function useSyncState<T>(
  state: RecoilValueReadOnly<T>,
  replicaState: RecoilState<T>,
  doSync: boolean = true,
) {
  const value = useRecoilValue(state);
  const syncValue = useSetRecoilState(replicaState);

  useEffect(() => {
    if (doSync) {
      syncValue(value);
    }
  }, [value, syncValue, doSync, state, replicaState]);
}
