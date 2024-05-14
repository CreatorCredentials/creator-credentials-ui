import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { SignIn } from '@clerk/nextjs';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { getI18nProps } from '@/shared/utils/i18n';
import { UserRole } from '@/shared/typings/UserRole';
import { NoLogoBlankLayout } from '@/components/layouts/NoLogoblankLayout/NoLogoBlankLayout';

const CreatorLoginPage: NextPageWithLayout = () => (
  <div className="mt-1 flex flex-row items-center">
    <SignIn redirectUrl={UserRole.Creator} />
  </div>
);

CreatorLoginPage.getLayout = (page: ReactElement) => {
  return <NoLogoBlankLayout>{page}</NoLogoBlankLayout>;
};

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx.locale, ['login'])),
    },
  };
}) satisfies GetServerSideProps;

export default CreatorLoginPage;
