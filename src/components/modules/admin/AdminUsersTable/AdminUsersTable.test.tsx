import { fireEvent, screen, within } from '@testing-library/react';
import { render } from '@/shared/utils/testUtils';
import { ClerkRole } from '@/api/requests/getUser';
import { AdminUser } from '@/shared/typings/AdminUser';
import { shortenDid } from '@/components/shared/CopyableDid';
import { AdminUsersTable } from './AdminUsersTable';

const issuer: AdminUser = {
  id: 10,
  role: ClerkRole.Issuer,
  name: 'Alice',
  email: 'alice@acme.test',
  didKey: 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
  domain: 'acme.test',
  didWeb: null,
  organizationName: 'Acme Publishing',
  createdAt: '2026-05-04T13:37:12.632Z',
  counts: { credentials: 2, issuedCredentials: 4 },
};

const creator: AdminUser = {
  ...issuer,
  id: 20,
  role: ClerkRole.Creator,
  name: null,
  organizationName: null,
  email: null,
  domain: null,
  counts: { credentials: 1, issuedCredentials: 0 },
};

describe('AdminUsersTable', () => {
  it('shows the organisation with the e-mail beneath, a shortened DID and the counts', () => {
    render(<AdminUsersTable users={[issuer]} />);

    const row = screen.getByTestId('admin-user-row');
    expect(within(row).getByText('Acme Publishing')).toBeInTheDocument();
    expect(within(row).getByText('alice@acme.test')).toBeInTheDocument();
    expect(within(row).getByText(shortenDid(issuer.didKey))).toHaveAttribute(
      'title',
      issuer.didKey,
    );
    expect(within(row).getByText('acme.test')).toBeInTheDocument();
    expect(within(row).getByText('2')).toBeInTheDocument();
    expect(within(row).getByText('4')).toBeInTheDocument();
    expect(within(row).getByText('04 May 2026')).toBeInTheDocument();
  });

  it('links issuers to their issued credentials and creators to their own', async () => {
    render(<AdminUsersTable users={[issuer, creator]} />);
    const menus = screen.getAllByTestId('admin-user-menu');

    fireEvent.click(menus[0]);
    expect(await screen.findByTestId('admin-user-credentials')).toHaveAttribute(
      'href',
      '/admin/credentials?issuerId=10',
    );

    fireEvent.click(menus[1]);
    const links = await screen.findAllByTestId('admin-user-credentials');
    expect(links.at(-1)).toHaveAttribute(
      'href',
      `/admin/credentials?q=${encodeURIComponent(creator.didKey)}`,
    );
  });

  it('falls back to a placeholder when a creator has no name, e-mail or domain', () => {
    render(<AdminUsersTable users={[creator]} />);

    const row = screen.getByTestId('admin-user-row');
    expect(within(row).getAllByText('—')).toHaveLength(2);
  });
});
