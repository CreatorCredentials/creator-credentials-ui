import { useRouter } from 'next/router';
import { useTranslation } from '@/shared/utils/useTranslation';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { useIssuersCredentials } from '@/api/queries/useIssuersCredentials';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { CredentialType } from '@/shared/typings/CredentialType';
import { useIssuerCreators } from '@/api/queries/useIssuerCreators';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
import { CreatorDetailsCard } from '@/components/shared/CreatorDetailsCard';
import { CredentialsCardAcceptRejectFooter } from '../CredentialsCardAcceptRejectFooter';
import { CreatorsFilters } from '../CreatorsFilters';

const CREDENTIAL_TYPE_LABELS: Partial<Record<CredentialType, string>> = {
  [CredentialType.Member]: 'Membership',
  [CredentialType.DataSupplier]: 'Data Supplier',
};

export const IssuerRequestedCredentials = () => {
  const { t } = useTranslation('issuer-creators');
  const router = useRouter();

  const { data, status, isLoading } = useIssuersCredentials({
    params: {
      status: CredentialVerificationStatus.Pending,
    },
  });
  const {
    data: creatorsData,
    status: cStatus,
    isLoading: cIsLoading,
  } = useIssuerCreators({
    params: {
      status: CreatorVerificationStatus.Accepted,
    },
  });

  if (status === 'error' || cStatus === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-creators')} />;
  }

  if (isLoading || cIsLoading) {
    return <Loader />;
  }

  return (
    <>
      <CreatorsFilters />
      <div className="-mx-10 grid grid-cols-2 gap-6 px-10">
        {data.credentials.map((credential) => {
          const creator = creatorsData?.creators.find(
            (c) => parseInt(c.id) === credential.data.userId,
          );

          const credentialTypeLabel =
            CREDENTIAL_TYPE_LABELS[credential.type as CredentialType] ??
            credential.type;

          return creator ? (
            <CreatorDetailsCard
              key={creator.id}
              creator={creator}
              subtitle={credentialTypeLabel}
              backRoute="/issuer/credentials/requested"
              renderFooter={() =>
                credential.status === CredentialVerificationStatus.Pending ? (
                  <CredentialsCardAcceptRejectFooter
                    credential={credential}
                    creator={creator}
                    onSuccessfullAcceptation={() => {
                      router.push('/issuer/credentials/issued');
                    }}
                  />
                ) : (
                  <ColoredBadge
                    badgeType="accepted"
                    className="self-center"
                  />
                )
              }
            />
          ) : null;
        })}
      </div>
    </>
  );
};
