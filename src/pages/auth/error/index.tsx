import { ReactElement } from 'react';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';

const AuthErrorPage: NextPageWithLayout = () => (
  <main className="flex flex-1 flex-col items-center justify-center gap-[2.125rem]">
    Your code is not valid. Please try again.
  </main>
);

AuthErrorPage.getLayout = (page: ReactElement) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export default AuthErrorPage;
