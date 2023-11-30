import { useEffect } from 'react';
import { RecoilState, RecoilValueReadOnly, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * Sync an external value to a recoil state
 */
export function useSyncValueToRecoil<T>(
  value: T,
  replicaState: RecoilState<T>,
  doSync: boolean = true,
) {
  const setState = useSetRecoilState(replicaState);

  useEffect(() => {
    if (doSync) {
      setState(value);
    }
  }, [doSync, setState, value]);
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

  useSyncValueToRecoil(value, replicaState, doSync);
}
