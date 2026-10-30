import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { render } from '@/shared/utils/testUtils';
import { CredentialType } from '@/shared/typings/CredentialType';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CreatorConnectionStatus } from '@/shared/typings/CreatorConnectionStatus';
import { IssuedCredential } from '@/shared/typings/Credentials';
import { IssuerIssuedCredentials } from './IssuerIssuedCredentials';

type QueryState = {
  data?: { credentials: IssuedCredential[] };
  isError?: boolean;
  isPending?: boolean;
  isFetching?: boolean;
  isPlaceholderData?: boolean;
};

const useIssuersCredentials = vi.fn();
let queryState: QueryState = {};

vi.mock('@/api/queries/useIssuersCredentials', () => ({
  useIssuersCredentials: (...args: unknown[]) => {
    useIssuersCredentials(...args);
    return {
      isError: false,
      isPending: false,
      isFetching: false,
      isPlaceholderData: false,
      ...queryState,
    };
  },
}));

vi.mock('@/api/mutations/useRevokeCredential', () => ({
  useRevokeCredential: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('@/shared/hooks/useIsDataSupplierIssuer', () => ({
  useIsDataSupplierIssuer: () => false,
}));

const issued: IssuedCredential = {
  id: 'issued-1',
  status: CredentialVerificationStatus.Success,
  type: CredentialType.Member,
  data: { companyName: 'Acme' },
  issuedAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T10:00:00.000Z',
  connectionStatus: CreatorConnectionStatus.Accepted,
  creator: {
    id: 7,
    name: 'Alice Example',
    email: 'alice@example.org',
    didKey: 'did:key:zAlice',
  },
};

const revoked: IssuedCredential = {
  ...issued,
  id: 'revoked-1',
  status: CredentialVerificationStatus.Revoked,
  revokedAt: '2026-10-01T10:00:00.000Z',
  revokedReason: 'Left',
  connectionStatus: CreatorConnectionStatus.Revoked,
  creator: {
    id: 8,
    name: 'Bob Builder',
    email: 'bob@builders.io',
    didKey: 'did:key:zBob',
  },
};

const lastStatusParam = () =>
  useIssuersCredentials.mock.lastCall?.[0].params.status;

describe('IssuerIssuedCredentials', () => {
  beforeEach(() => {
    useIssuersCredentials.mockClear();
    queryState = { data: { credentials: [issued] } };
  });

  it('queries SUCCESS first and switches the status param with the chips', async () => {
    render(<IssuerIssuedCredentials />);

    expect(lastStatusParam()).toBe(CredentialVerificationStatus.Success);

    await userEvent.click(screen.getByTestId('issued-status-revoked'));
    expect(lastStatusParam()).toBe(CredentialVerificationStatus.Revoked);

    await userEvent.click(screen.getByTestId('issued-status-success'));
    expect(lastStatusParam()).toBe(CredentialVerificationStatus.Success);
  });

  it('keeps the cached grid and shows the banner when a refetch fails', () => {
    queryState = { data: { credentials: [issued] }, isError: true };
    render(<IssuerIssuedCredentials />);

    expect(screen.getByTestId('issued-error-banner')).toBeInTheDocument();
    expect(screen.getAllByTestId('credential-card')).toHaveLength(1);
    expect(screen.queryByTestId('issued-empty')).not.toBeInTheDocument();
  });

  it('shows the banner and the empty state when the first fetch fails', () => {
    queryState = { isError: true };
    render(<IssuerIssuedCredentials />);

    expect(screen.getByTestId('issued-error-banner')).toBeInTheDocument();
    expect(screen.getByTestId('issued-empty')).toHaveTextContent(
      'issued.empty.no-credentials',
    );
    expect(screen.queryByTestId('credential-card')).not.toBeInTheDocument();
  });

  it('offers the revoke action on SUCCESS rows only', async () => {
    queryState = { data: { credentials: [issued, revoked] } };
    render(<IssuerIssuedCredentials />);

    await userEvent.click(screen.getByTestId('issued-view-table'));
    const rows = screen.getAllByTestId('credential-row');
    expect(rows).toHaveLength(2);

    await userEvent.click(within(rows[0]).getByTestId('credential-menu'));
    expect(screen.getByTestId('credential-revoke')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');

    // A revoked credential without a JWT has no actions at all.
    expect(
      within(rows[1]).queryByTestId('credential-menu'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('credential-revoke')).not.toBeInTheDocument();
  });

  it('marks only a revoked connection', () => {
    queryState = { data: { credentials: [issued, revoked] } };
    render(<IssuerIssuedCredentials />);

    const cards = screen.getAllByTestId('credential-card');
    expect(
      within(cards[0]).queryByTestId('connection-revoked-marker'),
    ).not.toBeInTheDocument();
    expect(
      within(cards[1]).getByTestId('connection-revoked-marker'),
    ).toBeInTheDocument();
  });

  it('shows a spinner and disables revoking while previous rows are displayed', async () => {
    queryState = {
      data: { credentials: [issued] },
      isFetching: true,
      isPlaceholderData: true,
    };
    render(<IssuerIssuedCredentials />);

    expect(screen.getByTestId('issued-switching')).toBeInTheDocument();
    expect(screen.getAllByTestId('credential-card')).toHaveLength(1);

    await userEvent.click(screen.getByTestId('credential-menu'));
    expect(screen.getByTestId('credential-revoke')).toBeDisabled();
  });

  it('shows the empty states for no credentials and for no matches', async () => {
    queryState = { data: { credentials: [] } };
    const { unmount } = render(<IssuerIssuedCredentials />);
    expect(screen.getByTestId('issued-empty')).toHaveTextContent(
      'issued.empty.no-credentials',
    );
    unmount();

    queryState = { data: { credentials: [issued] } };
    render(<IssuerIssuedCredentials />);
    await userEvent.type(screen.getByTestId('issued-search'), 'nobody');
    expect(screen.getByTestId('issued-empty')).toHaveTextContent(
      'issued.empty.no-matches',
    );
  });
});
