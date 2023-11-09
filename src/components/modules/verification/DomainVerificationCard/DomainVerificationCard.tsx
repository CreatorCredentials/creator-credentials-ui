import { Button } from 'flowbite-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { ElementType, useCallback } from 'react';
import { CardWithBadge } from '@/components/shared/CardWithBadge';
import { CredentialVerificationStatus } from '@/shared/typings/CredentialVerificationStatus';
import { ColoredBadge } from '@/components/shared/ColoredBadge';

type DomainVerificationCardProps = {
  value?: string | null;
  status?: CredentialVerificationStatus;
};

export const DomainVerificationCard = ({
  value,
  status,
}: DomainVerificationCardProps) => {
  const { t } = useTranslation('verification-creator');

  // TODO: Implement disconnect button handler after API is ready
  const disconnectButtonHandler = () => {};

  const renderFooter = useCallback(() => {
    switch (status) {
      case CredentialVerificationStatus.NotStarted:
        return (
          <Button
            color="primary"
            fullSized
            href="/creator/verification/domain"
            as={Link as ElementType}
          >
            {t('domain.buttons.start-verification')}
          </Button>
        );
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
    }
  }, [status, t]);

  return (
    <CardWithBadge
      badgeType="verification"
      title={t('domain.title')}
      iconName="Public"
      className="flex-1"
      content={
        value && status !== CredentialVerificationStatus.NotStarted ? (
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
