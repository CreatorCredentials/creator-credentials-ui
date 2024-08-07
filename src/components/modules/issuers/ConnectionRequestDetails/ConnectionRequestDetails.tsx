import { Button, Card } from 'flowbite-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useConfirmCreatorToIssuerConnectionRequest } from '@/api/mutations/useConfirmCreatorToIssuerConnectionRequest';
import { useIssuerDetailsWithCredentials } from '@/api/queries/useIssuerDetails';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { Icon } from '@/components/shared/Icon';
import { IssuerDetailsCard } from '@/components/shared/IssuerDetailsCard';
import { Loader } from '@/components/shared/Loader';
import { useToast } from '@/shared/hooks/useToast';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { QueryKeys } from '@/api/queryKeys';
import { useCreatorCredentials } from '@/api/queries/useCreatorCredentials';
import { VerifiedCredentialsUnion } from '@/shared/typings/Credentials';
import { SuccessfullCredentialRequestConfirmationCard } from '../../../shared/SuccessfullCredentialRequestConfirmationCard';

type ConnectionRequestDetailsProps = {
  issuerId: string;
};

export const ConnectionRequestDetails = ({
  issuerId,
}: ConnectionRequestDetailsProps) => {
  const { t } = useTranslation('creator-issuers-request');
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data,
    status,
    isLoading: isLoadingIssuerDetails,
  } = useIssuerDetailsWithCredentials({
    issuerId,
  });

  const {
    mutateAsync,
    isLoading: isConfirmingRequest,
    isSuccess: successfullyConfirmedRequest,
  } = useConfirmCreatorToIssuerConnectionRequest({
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.creatorIssuers]);
    },
  });

  const {
    isLoading,
    status: credStatus,
    data: credentials,
  } = useCreatorCredentials();

  const credentialsArray = useMemo(
    () =>
      Object.values(
        (credentials && {
          email: credentials.email,
          domain: credentials.domain,
          wallet: credentials.wallet,
        }) ||
          [],
      )
        .flat()
        .filter(Boolean) as VerifiedCredentialsUnion[],
    [credentials],
  );

  const confirmButtonHandler = async () => {
    try {
      await mutateAsync({
        issuerId,
      });
    } catch (error) {
      toast.error(t('errors.connection-request'));
    }
  };

  if (isLoadingIssuerDetails || isLoading) {
    return <Loader />;
  }

  if (status === 'error' || credStatus === 'error') {
    return <ApiErrorMessage message={t('errors.issuer-details')} />;
  }

  if (successfullyConfirmedRequest) {
    return <SuccessfullCredentialRequestConfirmationCard />;
  }

  return (
    <Card>
      <div className="flex flex-col gap-14">
        <article className="flex flex-col gap-6">
          <h3 className="text-xl">{t('card.title')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <IssuerDetailsCard
              issuer={data.issuer}
              renderFooter={null}
            />
          </div>
        </article>
        <article className="flex flex-col gap-6">
          <h3 className="text-xl">{t('card.credentials-description')}</h3>
          <div className="grid grid-cols-3 gap-4">
            {credentialsArray.map((vc) => (
              <CredentialDetailsCard
                dropdownItems={[]}
                key={vc.id}
                credential={vc}
              />
            ))}
          </div>
        </article>
        <footer>
          <p className="text-base">{t('card.confirmation-description')}</p>
          <Button
            color="primary"
            className="mt-4"
            onClick={confirmButtonHandler}
            isProcessing={isConfirmingRequest}
            disabled={isConfirmingRequest}
          >
            {t('confirm', { ns: 'common' })}
            <Icon
              className="ms-2"
              icon="ArrowRight"
            />
          </Button>
        </footer>
      </div>
    </Card>
  );
};
