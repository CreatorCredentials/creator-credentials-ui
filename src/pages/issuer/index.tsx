import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { useTranslation } from 'next-i18next';
import { withAuth } from '@/components/modules/app';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { UserRole } from '@/shared/typings/UserRole';
import { getI18nProps } from '@/shared/utils/i18n';
import { PageHeader } from '@/components/shared/PageHeader';
import { IssuerWelcomeCard } from '@/components/modules/home/issuer/IssuerWelcomeCard';
import { IssuerVerifyDomainCard } from '@/components/modules/home/issuer/IssuerVerifyDomainCard';
import { IssuerDidWebVerificationCard } from '@/components/modules/home/issuer/IssuerDidWebVerificationCard';
import { IssuerQCertVerificationCard } from '@/components/modules/home/issuer/IssuerQCertVerificationCard';

const IssuerHomePage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const { t } = useTranslation('home-issuer');

  return (
    <main className="flex flex-1 flex-col gap-6">
      <PageHeader title={t('header.title')} />
      <div className="flex flex-col gap-5">
        <IssuerWelcomeCard />
        <div className="flex gap-5">
          <IssuerVerifyDomainCard />
          <IssuerDidWebVerificationCard />
        </div>
        <section className="flex flex-col gap-5">
          <header>
            <h2 className="text-xl text-black">
              {t('qualified-certificates.title')}
            </h2>
          </header>
          <div className="grid grid-cols-2 gap-5">
            <IssuerQCertVerificationCard />
          </div>
        </section>
      </div>
    </main>
  );
};

export const getServerSideProps = withAuth(
  async (ctx: GetServerSidePropsContext) => {
    return {
      props: {
        ...(await getI18nProps(ctx.locale, ['home', 'home-issuer'])),
      },
    };
  },
  {
    roles: UserRole.Issuer,
  },
) satisfies GetServerSideProps;

export default IssuerHomePage;
