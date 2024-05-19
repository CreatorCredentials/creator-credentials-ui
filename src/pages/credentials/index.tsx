import { GetServerSideProps } from 'next';
import { ReactElement, useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { useTranslation } from '@/shared/utils/useTranslation';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { withAuth } from '@/components/modules/app';
import { UserRole } from '@/shared/typings/UserRole';
import { PageHeader } from '@/components/shared/PageHeader';
import { NoLogoBlankLayout } from '@/components/layouts/NoLogoblankLayout/NoLogoBlankLayout';
import { useCreatorCredentials } from '@/api/queries/useCreatorCredentials';
import { useConnectLicciumDidKey } from '@/api/mutations/useConnectLicciumDidKey';

const CredentialsImportPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  const [licciumDidKey, setLicciumDidKey] = useState<string | null>(null);

  const {
    mutateAsync: mutateConnectLicciumDidKey,
    // isLoading: isConnectingMutationRunning,
  } = useConnectLicciumDidKey();

  useEffect(() => {
    const lister = (e: MessageEvent) => {
      //eslint-disable-next-line
      console.log(e);
      if (e.data.type === 'liccium-did-provide') {
        //eslint-disable-next-line
        console.log('liccium-did provided: ', e.data.payload.didKey);
        setLicciumDidKey(e.data.payload.didKey || null);
        //issue connect credentials if emails are the same
      }
    };

    window.addEventListener('message', lister);
    return () => {
      window.removeEventListener('message', lister);
    };
  }, []); // no dependencies

  const { refetch: refetchCreatorCredentials } = useCreatorCredentials();
  async function importCredentials() {
    //export credentials only if connection credential is issued
    if (licciumDidKey) {
      await mutateConnectLicciumDidKey({
        payload: {
          licciumDidKey,
        },
      });
      const { data: creatorCredentials } = await refetchCreatorCredentials();
      window.top?.postMessage(
        { type: 'credentials-import', payload: creatorCredentials },
        '*',
      );
    }
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
