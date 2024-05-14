import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { Button } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { withAuth } from '@/components/modules/app';
import { UserRole } from '@/shared/typings/UserRole';
import { PageHeader } from '@/components/shared/PageHeader';
import { NoLogoBlankLayout } from '@/components/layouts/NoLogoblankLayout/NoLogoBlankLayout';
import { useCreatorCredentials } from '@/api/queries/useCreatorCredentials';

const CredentialsImportPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  const { data } = useCreatorCredentials();
  function importCredentials() {
    window.top?.postMessage({ type: 'credentials-import', payload: data }, '*');
  }
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <PageHeader title={t('credentials-import')} />

        <div className="flex w-60 flex-col items-center">
          <Button
            color="primary"
            className="self-stretch"
            onClick={importCredentials}
          >
            {t('credentials-import-button')}
          </Button>
        </div>
      </div>
    </>
  );
};
CredentialsImportPage.getLayout = (page: ReactElement) => {
  return <NoLogoBlankLayout>{page}</NoLogoBlankLayout>;
};

export const getServerSideProps = withAuth(
  async (ctx) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, [])),
      },
    };
  },
  {
    roles: [UserRole.Creator],
  },
) satisfies GetServerSideProps;

export default CredentialsImportPage;
