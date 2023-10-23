import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useTranslation } from 'next-i18next';
import { withAuth } from '@/components/modules/app';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { PageTitleHeading } from '@/components/shared/PageTitleHeading';
import { PageDescriptionCard } from '@/components/modules/home/PageDescriptionCard';
import { SelectIssuerCard } from '@/components/modules/home/creator/SelectIssuerCard';
import { AddNewCredentialCard } from '@/components/modules/home/creator/AddNewCredentialCard';
import { VerifyWalletCard } from '@/components/modules/home/creator/VerifyWalletCard';

const HomePage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const { t } = useTranslation('home-creator');

  return (
    <main className="flex flex-1 flex-col gap-5">
      <PageTitleHeading>{t('welcome', { ns: 'home' })}</PageTitleHeading>
      <PageDescriptionCard />
      <SelectIssuerCard />
      <div className="flex gap-5">
        <AddNewCredentialCard className="flex-1 self-start" />
        <VerifyWalletCard className="flex-1 self-start" />
      </div>
    </main>
  );
};

export const getServerSideProps = withAuth(
  async (ctx: GetServerSidePropsContext) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, ['home', 'home-creator'])),
      },
    };
  },
) satisfies GetServerSideProps;

export default HomePage;
