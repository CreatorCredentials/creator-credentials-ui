import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { HelloWorld } from '@/components/modules/helloWorld/HelloWorld';
import { getI18nProps } from '@/shared/utils/i18n';
import { helloWorldQueryOptions } from '@/shared/queries/useHelloWorldQuery';

export default function Home() {
  return (
    <main>
      <HelloWorld />
    </main>
  );
}

export const getServerSideProps = (async (ctx) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(helloWorldQueryOptions);

  return {
    props: {
      ...(await getI18nProps(ctx.locale)),
      dehydratedState: dehydrate(queryClient),
    },
  };
}) satisfies GetServerSideProps;
