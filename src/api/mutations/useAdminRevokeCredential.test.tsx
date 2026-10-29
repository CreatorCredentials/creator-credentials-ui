import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { QueryKeys } from '@/api/queryKeys';
import { useAdminRevokeCredential } from './useAdminRevokeCredential';

const revokeAdminCredential = vi.fn();

vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: () => Promise.resolve('token') }),
}));

vi.mock('../requests/revokeAdminCredential', () => ({
  revokeAdminCredential: (...args: unknown[]) => revokeAdminCredential(...args),
}));

const renderMutation = (queryClient: QueryClient) =>
  renderHook(() => useAdminRevokeCredential(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

describe('useAdminRevokeCredential', () => {
  beforeEach(() => {
    revokeAdminCredential.mockReset();
  });

  it('posts to the admin revoke endpoint with the bearer token', async () => {
    const revoked = { id: '42', status: 'REVOKED' };
    revokeAdminCredential.mockResolvedValue({ data: revoked });
    const { result } = renderMutation(new QueryClient());

    await expect(
      result.current.mutateAsync({ credentialId: '42', reason: 'Fraud' }),
    ).resolves.toEqual(revoked);

    expect(revokeAdminCredential).toHaveBeenCalledWith(
      { credentialId: '42', reason: 'Fraud' },
      'token',
    );
  });

  it('invalidates the admin list, the credential and the stats', async () => {
    revokeAdminCredential.mockResolvedValue({ data: {} });
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderMutation(queryClient);

    await result.current.mutateAsync({ credentialId: '42' });

    await waitFor(() => expect(invalidateQueries).toHaveBeenCalledTimes(3));
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [QueryKeys.adminCredentials],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [QueryKeys.adminCredential, '42'],
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [QueryKeys.adminStats],
    });
  });
});
