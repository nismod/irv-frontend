import { throttle } from 'lodash';
import { useEffect, useMemo } from 'react';

import { useTrackingRef } from './use-tracking-ref';

export function useThrottledCallback<Args extends any[]>(
  callback: (...args: Args) => void,
  ms: number,
  leading: boolean = false,
  trailing: boolean = true,
) {
  const callbackRef = useTrackingRef(callback);

  const throttledHandler = useMemo(
    () =>
      throttle(
        (...args: Args) => {
          callbackRef.current(...args);
        },
        ms,
        { leading, trailing },
      ),
    [ms, callbackRef, leading, trailing],
  );

  useEffect(() => {
    return () => {
      throttledHandler.cancel();
    };
  }, [throttledHandler]);

  return throttledHandler;
}
