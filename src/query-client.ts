import { QueryClient, QueryFunction, QueryKey, useQuery } from 'react-query';

export const queryClient = new QueryClient();

export function makeQueryAndPrefetch<
  TArgs extends Record<string, any>,
  TQueryKey extends QueryKey,
  TResult,
>(keyFn: (args: TArgs) => TQueryKey, makeFetcher: (args: TArgs) => QueryFunction<TResult>) {
  return [
    (args: TArgs, ...reactQueryOptions: any) => {
      return useQuery(keyFn(args), makeFetcher(args), ...reactQueryOptions);
    },
    (args: TArgs, signal: AbortSignal) => {
      const key = keyFn(args);

      signal?.addEventListener('abort', () => {
        queryClient.cancelQueries(key);
      });

      return queryClient.fetchQuery(key, makeFetcher(args));
    },
  ] as const;
}
