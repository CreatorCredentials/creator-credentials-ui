import { useTranslation } from 'next-i18next';
import { HomeCard } from '@/components/modules/home/HomeCard';
import { LinkButton } from '@/components/shared/LinkButton';

type AddNewCredentialCardProps = {
  className?: string;
};

export const AddNewCredentialCard = ({
  className,
}: AddNewCredentialCardProps) => {
  const { t } = useTranslation('home-creator');

  // TODO: Replace with query after credentials implementation
  const hasCredentials = false;

  return (
    <HomeCard
      title={t('add-credential.title')}
      className={className}
      badge={{
        iconName: 'Caption',
        color: 'primary',
        label: t('add-credential.badge'),
      }}
      renderFooter={({ icon }) => (
        <>
          {!hasCredentials && (
            <p className="mb-4 whitespace-pre-line text-lg text-warning">
              {t('add-credential.connect-issuer-warning')}
            </p>
          )}
          <LinkButton
            color="primary"
            href="/credentials"
            className="inline"
            disabled={!hasCredentials}
          >
            {t('add', { ns: 'common' })}
            {icon}
          </LinkButton>
        </>
      )}
    >
      <p className="text-lg text-grey-4">{t('add-credential.subtitle')}</p>
    </HomeCard>
  );
};
