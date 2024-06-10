import { GetServerSideProps } from 'next';
import { ReactElement, useEffect, useState } from 'react';
import { Button, Sidebar } from 'flowbite-react';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from '@/shared/utils/useTranslation';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { withAuth } from '@/components/modules/app';
import { UserRole } from '@/shared/typings/UserRole';
import { PageHeader } from '@/components/shared/PageHeader';
import { NoLogoBlankLayout } from '@/components/layouts/NoLogoblankLayout/NoLogoBlankLayout';
import { useCreatorCredentials } from '@/api/queries/useCreatorCredentials';
import { useConnectLicciumDidKey } from '@/api/mutations/useConnectLicciumDidKey';
import { NavigationSignOutButton } from '@/components/layouts/sidebarLayout/Navigation/NavigationSignOutButton';

const CredentialsImportPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');

  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const [isDidErrorVisible, setIsDidErrorVisible] = useState<boolean>(false);

  const [licciumDidKey, setLicciumDidKey] = useState<string | null>(null);
  const [licciumEmail, setLicciumEmail] = useState<string | null>(null);
  const user = useUser();
  const currentEmail = user.user?.emailAddresses[0].emailAddress;
  const errorMessage = `You've logged in with email ${currentEmail} to CreatorCredential App. Please login using the same email as at Liccium.app`;
  const didErrorMessage = `Check of did:key went wrong. Please try again.`;
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
        //eslint-disable-next-line
        console.log('liccium-did provided: ', e.data.payload.eMail);
        setLicciumDidKey(e.data.payload.didKey || null);
        setLicciumEmail(e.data.payload.eMail || null);
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
    if (licciumEmail !== currentEmail) {
      setIsErrorVisible(true);
      setIsDidErrorVisible(false);
      return;
    }
    if (licciumDidKey) {
      setIsErrorVisible(false);
      setIsDidErrorVisible(false);

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
    } else {
      setIsDidErrorVisible(true);
    }
  }
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <PageHeader title={t('credentials-import')} />

        <div className="flex h-[12rem] w-60 flex-col items-center">
          <Button
            color="primary"
            className="self-stretch"
            onClick={importCredentials}
          >
            {t('credentials-import-button')}
          </Button>
          {isErrorVisible && (
            <h4 className="mt-4 w-80 text-sm text-red-500">{errorMessage}</h4>
          )}
          {isDidErrorVisible && (
            <h4 className="mt-4 w-80 text-sm text-red-500">
              {didErrorMessage}
            </h4>
          )}
        </div>

        <Sidebar className="flex h-[4.5rem] w-[11.5rem] flex-col border-e-2 border-gray-200">
          <Sidebar.Items className="h-full">
            <Sidebar.ItemGroup className="relative flex h-full flex-col justify-between">
              <NavigationSignOutButton />
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
        {/* <SignOutButton>
            <p>{t('navigation.signout')}</p>
          </SignOutButton> */}
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
