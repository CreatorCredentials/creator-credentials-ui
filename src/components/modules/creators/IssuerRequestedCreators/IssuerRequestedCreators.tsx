import { useTranslation } from 'next-i18next';
import { useIssuerCreators } from '@/api/queries/useIssuerCreators';
import { ApiErrorMessage } from '@/components/shared/ApiErrorMessage';
import { Loader } from '@/components/shared/Loader';
import { CreatorVerificationStatus } from '@/shared/typings/CreatorVerificationStatus';
import { CreatorDetailsCard } from '@/components/shared/CreatorDetailsCard';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { Creator } from '@/shared/typings/Creator';
import { CreatorCardAcceptRejectFooter } from '../CreatorCardAcceptRejectFooter';
import { CreatorsFilters } from '../CreatorsFilters';

export const IssuerRequestedCreators = () => {
  const { t } = useTranslation('issuer-creators');

  const { data, status, isFetching, isLoading } = useIssuerCreators({
    params: {
      status: CreatorVerificationStatus.Pending,
      search: '',
    },
  });

  const renderCreatorCardFooter = (creator: Creator) => {
    switch (creator.status) {
      case CreatorVerificationStatus.Pending:
        return <CreatorCardAcceptRejectFooter creator={creator} />;
      case CreatorVerificationStatus.Accepted:
        return (
          <ColoredBadge
            badgeType="accepted"
            className="self-center"
          />
        );
      case CreatorVerificationStatus.Rejected:
        return (
          <ColoredBadge
            badgeType="rejected"
            className="self-center"
          />
        );
    }
  };

  if (status === 'error') {
    return <ApiErrorMessage message={t('errors.fetching-creators')} />;
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <>
      <CreatorsFilters />
      <div className="grid grid-cols-3 gap-4">
        {data.creators.map((creator) => (
          <CreatorDetailsCard
            key={creator.id}
            creator={creator}
            renderFooter={renderCreatorCardFooter}
          />
        ))}
      </div>
    </>
  );
};
