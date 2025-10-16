import { throttle } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';

import { useTrackingRef } from './use-tracking-ref';

export function useThrottledCallback<Args extends any[]>(
  callback: (...args: Args) => void,
  ms: number,
  leading: boolean = false,
  trailing: boolean = true,
) {
  const callbackRef = useTrackingRef(callback);
  const throttledRef = useRef<ReturnType<typeof throttle>>();

  useEffect(() => {
    const handler = throttle(
      (...args: Args) => {
        callbackRef.current(...args);
      },
      ms,
      { leading, trailing },
    );

    throttledRef.current = handler;

    return () => {
      handler.cancel();
      throttledRef.current = undefined;
    };
  }, [callbackRef, leading, trailing, ms]);

  return useCallback((...args: Args) => {
    throttledRef.current?.(...args);
  }, []);
}
