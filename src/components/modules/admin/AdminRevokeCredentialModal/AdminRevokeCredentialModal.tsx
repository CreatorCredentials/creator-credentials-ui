import { Label, Textarea } from 'flowbite-react';
import { useId, useState } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useToast } from '@/shared/hooks/useToast';
import { useAdminRevokeCredential } from '@/api/mutations/useAdminRevokeCredential';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';

const REASON_MAX_LENGTH = 500;

type AdminRevokeCredentialModalProps = {
  credentialId: string;
  onClose: () => void;
};

export const AdminRevokeCredentialModal = ({
  credentialId,
  onClose,
}: AdminRevokeCredentialModalProps) => {
  const { t } = useTranslation('admin');
  const toast = useToast();
  const reasonFieldId = useId();
  const [reason, setReason] = useState('');
  const { mutateAsync: revokeCredential, isPending } =
    useAdminRevokeCredential();

  const confirmHandler = async () => {
    try {
      await revokeCredential({
        credentialId,
        reason: reason.trim() || undefined,
      });
    } catch {
      // The dialog stays open with the typed reason so the admin can retry.
      toast.error(t('credentials.revoke.error'));
      return;
    }
    toast.success(t('credentials.revoke.success'));
    onClose();
  };

  return (
    <ConfirmationModal
      title={t('credentials.revoke.title')}
      message={t('credentials.revoke.message')}
      confirmLabel={t('credentials.revoke.confirm')}
      isProcessing={isPending}
      testIds={{
        modal: 'admin-revoke-modal',
        confirm: 'admin-revoke-confirm',
        cancel: 'admin-revoke-cancel',
      }}
      onConfirm={confirmHandler}
      onCancel={onClose}
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor={reasonFieldId}
          value={t('credentials.revoke.reason-label')}
        />
        <Textarea
          id={reasonFieldId}
          rows={3}
          maxLength={REASON_MAX_LENGTH}
          placeholder={t('credentials.revoke.reason-placeholder')}
          value={reason}
          disabled={isPending}
          onChange={(event) => setReason(event.target.value)}
          data-testid="admin-revoke-reason"
        />
      </div>
    </ConfirmationModal>
  );
};
