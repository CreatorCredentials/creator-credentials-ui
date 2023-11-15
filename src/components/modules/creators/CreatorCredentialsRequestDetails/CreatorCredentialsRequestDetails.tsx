import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { useCredentialsRequestDetails } from '@/api/queries/useCredentialsRequestDetails';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { CreatorDetailsCard } from '@/components/shared/CreatorDetailsCard';
import { CredentialDetailsCard } from '@/components/shared/CredentialDetailsCard';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
import { QueryKeys } from '@/api/queryKeys';
import { GetCredentialsRequestDetailsResponse } from '@/api/requests/getCredentialsRequestDetails';
import { CreatorCardAcceptRejectFooter } from '../CreatorCardAcceptRejectFooter';

type CreatorCredentialsRequestDetailsProps = {
  creatorId: string;
};

export const CreatorCredentialsRequestDetails = ({
  creatorId,
}: CreatorCredentialsRequestDetailsProps) => {
  const { t } = useTranslation('issuer-creator-request-details');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status, isLoading, isFetching } =
    useCredentialsRequestDetails(creatorId);

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-details')} />;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  const successfulRejectionHandler = () => {
    router.push('/issuer/creators/requested');
  };

  const successfulAcceptanceHandler = () => {
    queryClient.setQueryData<GetCredentialsRequestDetailsResponse>(
      [QueryKeys.credentialsRequestDetails, creatorId],
      (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          creator: {
            ...oldData.creator,
            status: CreatorVerificationStatus.Accepted,
          },
        };
      },
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-4">
        <CreatorDetailsCard
          creator={data.creator}
          renderFooter={
            data.creator.status === CreatorVerificationStatus.Pending
              ? () => (
                  <CreatorCardAcceptRejectFooter
                    creator={data.creator}
                    onSuccessfulRejection={successfulRejectionHandler}
                    onSuccessfullAcceptation={successfulAcceptanceHandler}
                  />
                )
              : null
          }
        />
      </div>
      <h3 className="text-xl">{t('credentials.title')}</h3>
      <div className="grid grid-cols-3 gap-4">
        {data.credentials.map((credential) => (
          <CredentialDetailsCard
            key={credential.id}
            credential={credential}
          />
        ))}
      </div>
    </div>
  );
};
