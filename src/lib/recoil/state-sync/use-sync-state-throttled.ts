import { useEffect } from 'react';
import { RecoilState, RecoilValueReadOnly, useRecoilValue, useSetRecoilState } from 'recoil';

import { useThrottledCallback } from '@/lib/hooks/use-throttled-callback';

/**
 * Sync one piece of recoil state to another recoil state, with throttling
 */
export function useSyncStateThrottled<T>(
  /**
   * Recoil state to sync from
   */
  state: RecoilValueReadOnly<T>,
  /**
   * Recoil state to sync to
   */
  replicaState: RecoilState<T>,
  /**
   * Throttle time in milliseconds
   */
  ms: number,
) {
  const value = useRecoilValue(state);
  const syncValue = useSetRecoilState(replicaState);

  const syncValueThrottled = useThrottledCallback(syncValue, ms);

  useEffect(() => {
    syncValueThrottled(value);
  }, [value, syncValueThrottled]);
}
