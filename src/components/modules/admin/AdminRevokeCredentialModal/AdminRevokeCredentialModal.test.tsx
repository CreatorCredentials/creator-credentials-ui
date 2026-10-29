import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { render } from '@/shared/utils/testUtils';
import { AdminRevokeCredentialModal } from './AdminRevokeCredentialModal';

const mutateAsync = vi.fn();
const toast = { success: vi.fn(), error: vi.fn() };
let isPending = false;

vi.mock('@/api/mutations/useAdminRevokeCredential', () => ({
  useAdminRevokeCredential: () => ({ mutateAsync, isPending }),
}));

vi.mock('@/shared/hooks/useToast', () => ({
  useToast: () => toast,
}));

const renderModal = (onClose = vi.fn()) => {
  render(
    <AdminRevokeCredentialModal
      credentialId="42"
      onClose={onClose}
    />,
  );
  return onClose;
};

describe('AdminRevokeCredentialModal', () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
    isPending = false;
  });

  it('revokes through the admin mutation with the typed reason and closes', async () => {
    mutateAsync.mockResolvedValue({});
    const onClose = renderModal();

    await userEvent.type(screen.getByTestId('admin-revoke-reason'), 'Fraud');
    await userEvent.click(screen.getByTestId('admin-revoke-confirm'));

    expect(mutateAsync).toHaveBeenCalledWith({
      credentialId: '42',
      reason: 'Fraud',
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it('treats the reason as optional', async () => {
    mutateAsync.mockResolvedValue({});
    renderModal();

    await userEvent.click(screen.getByTestId('admin-revoke-confirm'));

    expect(mutateAsync).toHaveBeenCalledWith({
      credentialId: '42',
      reason: undefined,
    });
  });

  it('does not revoke when cancelled', async () => {
    const onClose = renderModal();

    await userEvent.click(screen.getByTestId('admin-revoke-cancel'));

    expect(mutateAsync).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stays open with an error toast when the revocation fails', async () => {
    mutateAsync.mockRejectedValue(new Error('500'));
    const onClose = renderModal();

    await userEvent.type(screen.getByTestId('admin-revoke-reason'), 'Retry');
    await userEvent.click(screen.getByTestId('admin-revoke-confirm'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByTestId('admin-revoke-modal')).toBeInTheDocument();
    expect(screen.getByTestId('admin-revoke-reason')).toHaveValue('Retry');
  });

  it('locks the controls while the request is in flight', () => {
    isPending = true;
    renderModal();

    expect(screen.getByTestId('admin-revoke-cancel')).toBeDisabled();
    expect(screen.getByTestId('admin-revoke-confirm')).toBeDisabled();
    expect(screen.getByTestId('admin-revoke-reason')).toBeDisabled();
  });
});
