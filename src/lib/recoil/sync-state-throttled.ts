import { useEffect } from 'react';
import { RecoilState, RecoilValueReadOnly, useRecoilValue, useSetRecoilState } from 'recoil';

import { useThrottledCallback } from '../hooks/use-throttled-callback';

export function useSyncStateThrottled<T>(
  state: RecoilValueReadOnly<T>,
  replicaState: RecoilState<T>,
  ms: number,
) {
  const value = useRecoilValue(state);
  const syncValue = useSetRecoilState(replicaState);

  const syncValueThrottled = useThrottledCallback(syncValue, ms);

  useEffect(() => {
    syncValueThrottled(value);
  }, [value, syncValueThrottled]);
}
