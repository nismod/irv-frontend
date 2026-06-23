import type { Atom, WritableAtom } from 'jotai';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { useThrottledCallback } from '@/lib/hooks/use-throttled-callback';

/**
 * Sync one piece of jotai state to another jotai atom, with throttling.
 *
 * Direct port of `useSyncStateThrottled` from `lib/recoil/state-sync/`.
 */
export function useSyncStateThrottled<T>(
  /**
   * Source atom to sync from
   */
  state: Atom<T>,
  /**
   * Atom to sync to
   */
  replicaState: WritableAtom<unknown, [T], unknown>,
  /**
   * Throttle time in milliseconds
   */
  ms: number,
) {
  const value = useAtomValue(state);
  const syncValue = useSetAtom(replicaState);

  const syncValueThrottled = useThrottledCallback(syncValue, ms);

  useEffect(() => {
    syncValueThrottled(value);
  }, [value, syncValueThrottled]);
}
