import { Spinner } from 'flowbite-react';
import { GetServerSideProps } from 'next';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useRef } from 'react';
import { NextPageWithLayout } from '@/shared/typings/NextPageWithLayout';
import { BlankLayout } from '@/components/layouts/blankLayout/BlankLayout';

type EmailLoginPageProps = {
  csrfToken: string;
};

const EmailLoginPage: NextPageWithLayout<EmailLoginPageProps> = ({
  csrfToken,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signInRan = useRef(false);

  const code = searchParams.get('code');

  const signInCallback = useCallback(async () => {
    try {
      const response = await signIn('email', {
        code,
        csrfToken,
        redirect: false,
      });

      if (!response?.ok) {
        throw new Error('Coud not sign in');
      }

      router.replace('/');
    } catch (err) {
      router.replace('/auth/error');
    }
  }, [csrfToken, router, code]);

  useEffect(() => {
    if (signInRan.current === false) {
      signInCallback();
    }

    return () => {
      signInRan.current = true;
    };
  }, [signInCallback]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <Spinner
        size="xl"
        aria-label="Signing in..."
      />
    </main>
  );
};

EmailLoginPage.getLayout = (page: ReactElement) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export const getServerSideProps = (async (ctx) => {
  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
    },
  };
}) satisfies GetServerSideProps;

export default EmailLoginPage;
