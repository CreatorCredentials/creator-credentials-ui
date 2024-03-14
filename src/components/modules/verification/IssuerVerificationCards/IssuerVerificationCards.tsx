import React from 'react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { UserRole } from '@/shared/typings/UserRole';
import { downloadJson } from '@/shared/utils/downloadJson';
import { useIssuerCredentials } from '@/api/queries/useIssuerCredentials';
import { DomainVerificationCard } from '../DomainVerificationCard';
import { DidWebVerificationCard } from '../did-web/DidWebVerificationCard';
import { EmailVerificationCard } from '../EmailVerificationCard';

export const IssuerVerificationCards = () => {
  // additional ready will state if translations are loaded or not
  const { t } = useTranslation('verification-cards', {
    useSuspense: false,
  });

  const {
    data: credentials,
    isFetching,
    isLoading,
    status,
  } = useIssuerCredentials({
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-credentials')} />;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }
  const email = credentials.email.data.address;
  const credentialObject = credentials.email.data.credentialObject;
  return (
    <section className="grid grid-cols-3 gap-4">
      <EmailVerificationCard
        email={email}
        dropdownItems={[
          {
            onClick: () =>
              downloadJson(
                `${email} ${credentialObject.validFrom}`,
                credentialObject,
              ),
            children: t('download', { ns: 'common' }),
          },
        ]}
      />
      <DomainVerificationCard
        value={credentials.domain?.data.domain}
        status={credentials.domain?.status}
        dropdownItems={[]}
        userRole={UserRole.Issuer}
      />
      <DidWebVerificationCard
        value={credentials.didWeb?.data.domain}
        status={credentials.didWeb?.status}
        dropdownItems={[]}
        userRole={UserRole.Issuer}
      />
    </section>
  );
};
