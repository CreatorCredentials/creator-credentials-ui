import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';

export function useAuthQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    queryFn: QueryFunction<TQueryFnData, TQueryKey>;
  },
): UseQueryResult<TData, TError> {
  const auth = useAuth();

  return useQuery({
    ...options,
    queryFn: () =>
      auth.getToken().then((token) =>
        options.queryFn({
          headers: { Authorization: `Bearer ${token}` },
          // eslint-disable-next-line
        } as any),
      ),
  });
}
