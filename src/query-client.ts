import { QueryClient, QueryFunction, QueryKey, useQuery } from 'react-query';

export const queryClient = new QueryClient();

export function makeQueryAndPrefetch<TArgs extends any[], TQueryKey extends QueryKey, TResult>(
  keyFn: (...args: TArgs) => TQueryKey,
  makeFetcher: (...args: TArgs) => QueryFunction<TResult>,
) {
  return [
    (...args: TArgs) => useQuery(keyFn(...args), makeFetcher(...args)),
    (signal: AbortSignal, ...args: TArgs) => {
      const key = keyFn(...args);

      signal.addEventListener('abort', () => {
        queryClient.cancelQueries(key);
      });

      return queryClient.fetchQuery(keyFn(...args), makeFetcher(...args));
    },
  ] as const;
}
