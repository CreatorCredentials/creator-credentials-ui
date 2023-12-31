import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ElementType, useCallback } from 'react';
import { CardWithBadge } from '@/components/shared/CardWithBadge';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { ColoredBadge } from '@/components/shared/ColoredBadge';
import { UserRole } from '@/shared/typings/UserRole';

type DomainVerificationCardProps = {
  value?: string | null;
  status?: CredentialVerificationStatus;
  userRole: UserRole;
};

export const DomainVerificationCard = ({
  value,
  status,
  userRole,
}: DomainVerificationCardProps) => {
  const { t } = useTranslation('verification-cards');

  // TODO: Implement disconnect button handler after API is ready
  const disconnectButtonHandler = () => {};

  const renderFooter = useCallback(() => {
    switch (status) {
      case CredentialVerificationStatus.Success:
        return (
          <>
            <Button
              color="primary"
              fullSized
              onClick={disconnectButtonHandler}
            >
              {t('disconnect', { ns: 'common' })}
            </Button>
            <ColoredBadge
              badgeType="verified"
              className="self-center"
            />
          </>
        );
      case CredentialVerificationStatus.Pending:
        return (
          <ColoredBadge
            badgeType="pending"
            className="self-center"
          />
        );
      default:
        return (
          <Button
            color="primary"
            fullSized
            href={`/${userRole.toLowerCase()}/verification/domain`}
            as={Link as ElementType}
          >
            {t('domain.buttons.start-verification')}
          </Button>
        );
    }
  }, [status, t, userRole]);

  return (
    <CardWithBadge
      badgeType="verification"
      title={t('domain.title')}
      image={{
        iconName: 'Public',
      }}
      className="flex-1"
      content={
        value && status ? (
          <CardWithBadge.ContentWithIcon
            iconName="Public"
            className="whitespace-pre-wrap"
          >
            {value}
          </CardWithBadge.ContentWithIcon>
        ) : (
          <p>{t('domain.description')}</p>
        )
      }
      footer={renderFooter()}
    />
  );
};
