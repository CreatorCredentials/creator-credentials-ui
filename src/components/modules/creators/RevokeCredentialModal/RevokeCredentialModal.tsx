import { Label, Textarea } from 'flowbite-react';
import { useId, useState } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useToast } from '@/shared/hooks/useToast';
import { useRevokeCredential } from '@/api/mutations/useRevokeCredential';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';

const REASON_MAX_LENGTH = 500;

type RevokeCredentialModalProps = {
  credentialId: string;
  onClose: () => void;
};

export const RevokeCredentialModal = ({
  credentialId,
  onClose,
}: RevokeCredentialModalProps) => {
  const { t } = useTranslation('issuer-credentials');
  const toast = useToast();
  const reasonFieldId = useId();
  const [reason, setReason] = useState('');
  const { mutateAsync: revokeCredential, isLoading } = useRevokeCredential();

  const confirmHandler = async () => {
    try {
      await revokeCredential({
        credentialId,
        reason: reason.trim() || undefined,
      });
    } catch (error) {
      // The dialog stays open with the typed reason so the user can retry.
      toast.error(t('issued.revoke.error'));
      return;
    }
    toast.success(t('issued.revoke.success'));
    onClose();
  };

  return (
    <ConfirmationModal
      title={t('issued.revoke.title')}
      message={t('issued.revoke.message')}
      confirmLabel={t('issued.revoke.confirm')}
      isProcessing={isLoading}
      testIds={{
        modal: 'revoke-modal',
        confirm: 'revoke-confirm',
        cancel: 'revoke-cancel',
      }}
      onConfirm={confirmHandler}
      onCancel={onClose}
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor={reasonFieldId}
          value={t('issued.revoke.reason-label')}
        />
        <Textarea
          id={reasonFieldId}
          rows={3}
          maxLength={REASON_MAX_LENGTH}
          placeholder={t('issued.revoke.reason-placeholder')}
          value={reason}
          disabled={isLoading}
          onChange={(event) => setReason(event.target.value)}
          data-testid="revoke-reason"
        />
      </div>
    </ConfirmationModal>
  );
};
