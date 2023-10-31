import { useTranslation } from 'next-i18next';
import { CardWithBadge } from '@/components/shared/CardWithBadge';
import { ColoredBadge } from '@/components/shared/ColoredBadge';

type EmailVerificationCardProps = {
  email: string;
};

export const EmailVerificationCard = ({
  email,
}: EmailVerificationCardProps) => {
  const { t } = useTranslation('verification-creator');

  return (
    <CardWithBadge
      badgeType="verification"
      title={t('e-mail.title')}
      iconName="Mail"
      className="flex-1"
      content={
        <CardWithBadge.ContentWithIcon iconName="Mail">
          {email}
        </CardWithBadge.ContentWithIcon>
      }
      footer={
        <ColoredBadge
          badgeType="verified"
          className="self-center"
        />
      }
    />
  );
};
