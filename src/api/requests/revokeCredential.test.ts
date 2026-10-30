import { vi } from 'vitest';
import axios from '@/api/axiosNest';
import { revokeCredential } from './revokeCredential';

vi.mock('@/api/axiosNest', () => ({
  default: { post: vi.fn() },
}));

describe('revokeCredential', () => {
  it('posts the reason to the revoke endpoint with the bearer token', () => {
    revokeCredential({ credentialId: '42', reason: 'Membership ended' }, 'jwt');

    expect(axios.post).toHaveBeenCalledWith(
      '/v1/credentials/42/revoke',
      { reason: 'Membership ended' },
      { headers: { Authorization: 'Bearer jwt' } },
    );
  });

  it('sends an undefined reason when none was given', () => {
    revokeCredential({ credentialId: '7' }, 'jwt');

    expect(axios.post).toHaveBeenCalledWith(
      '/v1/credentials/7/revoke',
      { reason: undefined },
      { headers: { Authorization: 'Bearer jwt' } },
    );
  });
});
