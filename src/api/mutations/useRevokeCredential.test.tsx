import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { QueryKeys } from '@/api/queryKeys';
import { useRevokeCredential } from './useRevokeCredential';

const revokeCredential = vi.fn();

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: () => Promise.resolve('token') }),
}));

vi.mock('../requests/revokeCredential', () => ({
  revokeCredential: (...args: unknown[]) => revokeCredential(...args),
}));

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

const renderMutation = (queryClient: QueryClient) =>
  renderHook(() => useRevokeCredential(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

describe('useRevokeCredential', () => {
  beforeEach(() => {
    revokeCredential.mockReset();
  });

  it('posts with the bearer token and resolves to the credential', async () => {
    const revoked = { id: '42', status: 'REVOKED' };
    revokeCredential.mockResolvedValue({ data: revoked });
    const { result } = renderMutation(new QueryClient());

    await expect(
      result.current.mutateAsync({ credentialId: '42', reason: 'Gone' }),
    ).resolves.toEqual(revoked);

    expect(revokeCredential).toHaveBeenCalledWith(
      { credentialId: '42', reason: 'Gone' },
      'token',
    );
  });

  it('settles only after both query invalidations finished', async () => {
    revokeCredential.mockResolvedValue({ data: {} });
    const queryClient = new QueryClient();
    const invalidation = deferred<void>();
    const invalidateQueries = vi
      .spyOn(queryClient, 'invalidateQueries')
      .mockReturnValue(invalidation.promise);
    const { result } = renderMutation(queryClient);

    let settled = false;
    const mutation = result.current
      .mutateAsync({ credentialId: '42' })
      .then(() => {
        settled = true;
      });

    await waitFor(() => expect(invalidateQueries).toHaveBeenCalledTimes(2));
    expect(invalidateQueries).toHaveBeenCalledWith([
      QueryKeys.issuersCredentials,
    ]);
    expect(invalidateQueries).toHaveBeenCalledWith([QueryKeys.issuerCreators]);
    expect(settled).toBe(false);

    invalidation.resolve();
    await mutation;

    expect(settled).toBe(true);
  });
});
