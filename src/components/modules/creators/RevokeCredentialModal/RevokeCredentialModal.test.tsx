import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { render } from '@/shared/utils/testUtils';
import { RevokeCredentialModal } from './RevokeCredentialModal';

const mutateAsync = vi.fn();
const toast = { success: vi.fn(), error: vi.fn() };
let isPending = false;

vi.mock('@/api/mutations/useRevokeCredential', () => ({
  useRevokeCredential: () => ({ mutateAsync, isPending }),
}));

vi.mock('@/shared/hooks/useToast', () => ({
  useToast: () => toast,
}));

describe('RevokeCredentialModal', () => {
  beforeEach(() => {
    mutateAsync.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
    isPending = false;
  });

  it('revokes with the typed reason and closes on success', async () => {
    mutateAsync.mockResolvedValue({});
    const onClose = vi.fn();
    render(
      <RevokeCredentialModal
        credentialId="42"
        onClose={onClose}
      />,
    );

    await userEvent.type(
      screen.getByTestId('revoke-reason'),
      'Membership ended',
    );
    await userEvent.click(screen.getByTestId('revoke-confirm'));

    expect(mutateAsync).toHaveBeenCalledTimes(1);
    expect(mutateAsync).toHaveBeenCalledWith({
      credentialId: '42',
      reason: 'Membership ended',
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('treats the reason as optional', async () => {
    mutateAsync.mockResolvedValue({});
    render(
      <RevokeCredentialModal
        credentialId="42"
        onClose={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByTestId('revoke-confirm'));

    expect(mutateAsync).toHaveBeenCalledWith({
      credentialId: '42',
      reason: undefined,
    });
  });

  it('does not revoke when cancelled', async () => {
    const onClose = vi.fn();
    render(
      <RevokeCredentialModal
        credentialId="42"
        onClose={onClose}
      />,
    );

    await userEvent.click(screen.getByTestId('revoke-cancel'));

    expect(mutateAsync).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error toast and stays open with the reason when the revocation fails', async () => {
    mutateAsync.mockRejectedValue(new Error('500'));
    const onClose = vi.fn();
    render(
      <RevokeCredentialModal
        credentialId="42"
        onClose={onClose}
      />,
    );

    await userEvent.type(screen.getByTestId('revoke-reason'), 'Retry me');
    await userEvent.click(screen.getByTestId('revoke-confirm'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
    expect(onClose).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.getByTestId('revoke-modal')).toBeInTheDocument();
    expect(screen.getByTestId('revoke-reason')).toHaveValue('Retry me');
  });

  it('cannot be dismissed while the request is in flight', async () => {
    isPending = true;
    const onClose = vi.fn();
    render(
      <RevokeCredentialModal
        credentialId="42"
        onClose={onClose}
      />,
    );

    await userEvent.click(screen.getByTestId('revoke-modal'));
    expect(screen.getByLabelText('close')).toBeDisabled();
    expect(screen.getByTestId('revoke-cancel')).toBeDisabled();
    expect(screen.getByTestId('revoke-confirm')).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders as a dialog', () => {
    render(
      <RevokeCredentialModal
        credentialId="42"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByTestId('revoke-modal')).toHaveAttribute(
      'role',
      'dialog',
    );
  });
});
