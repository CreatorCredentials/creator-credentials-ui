import { Button, Textarea } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import { useId } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FormLabel } from '@/components/formFields/FormLabel';
import { CardWithTitle } from '@/components/shared/CardWithTitle';
import { IconButton } from '@/components/shared/IconButton/IconButton';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { useConfirmDomainTxtRecordCreation } from '@/api/mutations/useConfirmDomainTxtRecordCreation';
import { useToast } from '@/shared/hooks/useToast';
import { QueryKeys } from '@/api/queryKeys';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { GetCreatorCredentialsResponse } from '@/api/requests/getCreatorCredentials';
import { CredentialType } from '@/shared/typings/CredentialType';
import { useDomainVerificationContext } from '../DomainVerificationContext';

export const DomainVerificationUpdateTxtRecordCard = () => {
  const { t } = useTranslation('domain-verification');
  const { copy } = useCopyToClipboard();
  const fieldId = useId();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { txtRecord, currentStep, domainAddress, setCurrentStep } =
    useDomainVerificationContext();

  const { mutateAsync, isLoading } = useConfirmDomainTxtRecordCreation({
    onSuccess: () => {
      queryClient.setQueryData<GetCreatorCredentialsResponse>(
        [QueryKeys.creatorVerifiedCredentials],
        (oldData) => {
          if (!oldData) return;

          return {
            ...oldData,
            domain: {
              id: 'temp-id', // TODO: remove this when we have real id
              type: CredentialType.Domain,
              data: {
                domain: domainAddress,
              },
              ...oldData.domain,
              status: CredentialVerificationStatus.Pending,
            },
          };
        },
      );
    },
  });

  const contentCopyHandler = () => {
    copy(txtRecord);
  };

  const confirmButtonHandler = async () => {
    try {
      await mutateAsync();
      setCurrentStep('verification');
    } catch (error) {
      toast.error(t('errors.txt-record-update'));
    }
  };

  return (
    <CardWithTitle
      title={t('cards.update-txt-record.title')}
      description={t('cards.update-txt-record.description')}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <FormLabel htmlFor={fieldId}>
            {t('cards.update-txt-record.fields.txt-record.label')}
          </FormLabel>
          <div className="flex items-center">
            <Textarea
              defaultValue={txtRecord}
              readOnly
              className="flex-1 resize-none"
            />
            <IconButton
              icon="ContentCopy"
              onClick={contentCopyHandler}
              aria-label={t('copy-to-clipboard.label', { ns: 'common' })}
            />
          </div>
        </div>
        <Button
          color="primary"
          className="self-start"
          onClick={confirmButtonHandler}
          isProcessing={isLoading}
          disabled={currentStep === 'verification'}
        >
          {t('cards.update-txt-record.button')}
        </Button>
      </div>
    </CardWithTitle>
  );
};
