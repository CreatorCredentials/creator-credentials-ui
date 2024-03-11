import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from '@/shared/utils/useTranslation';
import { useCreatorCredentials } from '@/api/queries/useCreatorCredentials';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { UserRole } from '@/shared/typings/UserRole';
import { useGetUser } from '@/api/queries/useGetUser';
import { DomainVerificationCard } from '../DomainVerificationCard';
import { EmailVerificationCard } from '../EmailVerificationCard';
import { MetamaskVerificationCard } from '../MetamaskVerificationCard';
import {
  AddressContext,
  useAddressData,
} from '../../../../contexts/AddressDataContext';

export const CreatorVerificationCards = () => {
  const { t } = useTranslation('creator-verification');

  const {
    data: verifiedCredentials,
    isFetching,
    isLoading,
    status,
  } = useCreatorCredentials({
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const clerkUser = useUser();
  const { updateData } = useAddressData();
  const emailAddress = clerkUser.user?.emailAddresses.toString() || '';
  const { data: user } = useGetUser();

  useEffect(() => {
    updateData({ address: user?.publicAddress || null });
    // eslint-disable-next-line
  }, [user]);

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-credentials')} />;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <AddressContext.Consumer>
      {({ data }) => (
        <section className="grid grid-cols-3 gap-4">
          <EmailVerificationCard email={emailAddress} />
          <MetamaskVerificationCard walletAddress={data.address} />
          <DomainVerificationCard
            value={verifiedCredentials.domain?.data.domain}
            status={verifiedCredentials.domain?.status}
            userRole={UserRole.Creator}
          />
        </section>
      )}
    </AddressContext.Consumer>
  );
};
