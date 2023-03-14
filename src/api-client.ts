import { AutoPkgClient } from '@nismod/irv-autopkg-client';

import { ApiClient } from './lib/api-client';

type CancelablePromise<T> = Promise<T> & { cancel: () => void };

export function cancelOnAbort<T>(promise: CancelablePromise<T>, signal: AbortSignal) {
  signal.addEventListener('abort', () => {
    promise.cancel();
  });

  return promise;
}

export const apiClient = new ApiClient({
  BASE: '/api',
});

export const autopkgClient = new AutoPkgClient({
  BASE: '/extract',
});
