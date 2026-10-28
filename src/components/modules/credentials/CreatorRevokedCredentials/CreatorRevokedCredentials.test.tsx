import { screen, within } from '@testing-library/react';
import { render } from '@/shared/utils/testUtils';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { CreatorRevokedCredentials } from './CreatorRevokedCredentials';

const revokedMembership: VerifiedCredentialsUnion = {
  id: '42',
  status: CredentialVerificationStatus.Revoked,
  type: CredentialType.Member,
  data: {
    companyName: 'Acme Publishing',
    credentialObject: { validFrom: '2026-09-01T10:00:00.000Z' },
  },
  revokedAt: '2026-10-20T10:00:00.000Z',
  revokedReason: 'Membership ended',
};

const issuedMembership: VerifiedCredentialsUnion = {
  id: '43',
  status: CredentialVerificationStatus.Success,
  type: CredentialType.Member,
  data: { companyName: 'Still Active Ltd' },
};

describe('CreatorRevokedCredentials', () => {
  it('renders only revoked credentials with issuer, date and reason', () => {
    render(
      <CreatorRevokedCredentials
        credentials={[revokedMembership, issuedMembership]}
      />,
    );

    const section = screen.getByTestId('creator-revoked-section');
    const cards = within(section).getAllByTestId('creator-revoked-card');
    const details = within(cards[0]).getByTestId('creator-revoked-details');

    expect(cards).toHaveLength(1);
    expect(within(details).getByText('Acme Publishing')).toBeInTheDocument();
    expect(within(details).getByText('20 Oct 2026')).toBeInTheDocument();
    expect(within(details).getByText('Membership ended')).toBeInTheDocument();
    expect(screen.queryByText('Still Active Ltd')).not.toBeInTheDocument();
  });

  it('keeps the download available on a revoked credential', () => {
    render(<CreatorRevokedCredentials credentials={[revokedMembership]} />);

    expect(screen.getByTestId('credential-download')).toBeEnabled();
  });

  it('falls back to a placeholder when no reason was given', () => {
    render(
      <CreatorRevokedCredentials
        credentials={[{ ...revokedMembership, revokedReason: null }]}
      />,
    );

    expect(screen.getByText('revoked.no-reason')).toBeInTheDocument();
  });

  it('shows an empty state when nothing was revoked', () => {
    render(<CreatorRevokedCredentials credentials={[issuedMembership]} />);

    expect(
      within(screen.getByTestId('creator-revoked-section')).getByText(
        'revoked.empty',
      ),
    ).toBeInTheDocument();
  });
});
